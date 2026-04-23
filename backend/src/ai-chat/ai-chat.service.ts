import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
    // Sử dụng gemini-1.5-flash cho tốc độ nhanh và tiết kiệm token
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getSessions(userId: string) {
    return this.prisma.ai_chat_sessions.findMany({
      where: { user_id: userId },
      orderBy: { last_interaction_at: 'desc' },
      take: 20,
    });
  }

  async createSession(userId: string) {
    return this.prisma.ai_chat_sessions.create({
      data: {
        user_id: userId,
        status: 'active',
      },
    });
  }

  async getMessages(sessionId: string, userId: string) {
    // Verify ownership
    const session = await this.prisma.ai_chat_sessions.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.user_id !== userId) {
      throw new NotFoundException('Session không tồn tại hoặc không thuộc về bạn');
    }

    return this.prisma.ai_chat_messages.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
    });
  }

  async sendMessage(sessionId: string, userId: string, content: string) {
    // 1. Kiểm tra session
    const session = await this.prisma.ai_chat_sessions.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.user_id !== userId) {
      throw new NotFoundException('Session không tồn tại');
    }

    // 2. Lưu tin nhắn của user
    await this.prisma.ai_chat_messages.create({
      data: {
        session_id: sessionId,
        sender_type: 'user',
        content,
      },
    });

    // 3. Chuẩn bị context cho AI (lấy dữ liệu Tour thực tế)
    const tours = await this.prisma.tours.findMany({
      where: {
        visibility_status: 'visible',
        business_status: 'published',
        deleted_at: null,
      },
      select: {
        title: true,
        province: true,
        price: true,
        description: true,
        start_date: true,
        end_date: true,
      },
      take: 10,
    });

    const toursContext = tours.map(t => {
      const durationDays = Math.ceil((t.end_date.getTime() - t.start_date.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return `- ${t.title} tại ${t.province}: ${durationDays} ngày, giá ${Number(t.price).toLocaleString()}đ. Mô tả: ${t.description?.substring(0, 100)}...`;
    }).join('\n');

    // 4. Lấy lịch sử hội thoại gần đây
    const history = await this.prisma.ai_chat_messages.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const chatHistory = history.reverse().map(m => ({
      role: m.sender_type === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // 5. Gọi Gemini API
    try {
      const systemInstruction = `Bạn là trợ lý du lịch thông minh của TravelConnectVN. 
      Nhiệm vụ của bạn là tư vấn tour du lịch và trả lời các câu hỏi về du lịch Việt Nam.
      Dưới đây là danh sách một số tour hiện có trên hệ thống của chúng tôi để bạn tham khảo và giới thiệu:
      ${toursContext}
      
      Hãy trả lời thân thiện, hữu ích và tập trung vào việc giúp người dùng tìm được tour phù hợp. 
      Nếu người dùng hỏi về tour không có trong danh sách, hãy trả lời dựa trên kiến thức của bạn nhưng vẫn khuyến khích họ khám phá các tour trên TravelConnectVN.`;

      const chat = this.model.startChat({
        history: chatHistory.slice(0, -1), // Không bao gồm tin nhắn vừa tạo
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      // Thêm system instruction vào prompt đầu tiên hoặc xử lý qua tham số nếu SDK hỗ trợ (gemini-1.5 hỗ trợ systemInstruction riêng)
      // Ở đây ta đơn giản là ghép vào message gửi đi nếu là message đầu, hoặc gán qua model config
      
      const prompt = content;
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const aiResponseText = response.text();

      // 6. Lưu phản hồi của AI
      const aiMessage = await this.prisma.ai_chat_messages.create({
        data: {
          session_id: sessionId,
          sender_type: 'bot',
          content: aiResponseText,
          model_name: 'gemini-1.5-flash',
        },
      });

      // 7. Cập nhật last_interaction_at của session
      await this.prisma.ai_chat_sessions.update({
        where: { id: sessionId },
        data: { last_interaction_at: new Date() },
      });

      return aiMessage;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new InternalServerErrorException('Lỗi khi kết nối với dịch vụ AI');
    }
  }
}
