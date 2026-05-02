import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiChatService {
  private client: GoogleGenAI;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    // Khởi tạo client theo đúng chuẩn tài liệu mới nhất
    this.client = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async getSessions(userId: string) {
    return this.prisma.ai_chat_sessions.findMany({
      where: { user_id: userId },
      include: {
        ai_chat_messages: {
          orderBy: { created_at: 'asc' },
          take: 1,
        },
      },
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
    const session = await this.prisma.ai_chat_sessions.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.user_id !== userId) {
      throw new NotFoundException('Session không tồn tại');
    }

    return this.prisma.ai_chat_messages.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
    });
  }

  async sendMessage(sessionId: string, userId: string, content: string) {
    const session = await this.prisma.ai_chat_sessions.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.user_id !== userId) {
      throw new NotFoundException('Session không tồn tại');
    }

    // 1. Lưu tin nhắn người dùng
    await this.prisma.ai_chat_messages.create({
      data: {
        session_id: sessionId,
        sender_type: 'user',
        content,
      },
    });

    // 2. Lấy context dữ liệu thực tế
    const tours = await this.prisma.tours.findMany({
      where: { visibility_status: 'visible', business_status: 'published', deleted_at: null },
      select: { title: true, province: true, price: true },
      take: 5,
    });
    const toursContext = tours.map(t => `- ${t.title} (${t.province}): ${Number(t.price).toLocaleString()}đ`).join('\n');

    // 3. Gọi Gemini API theo chuẩn tài liệu mới
    try {
      const systemInstruction = `Bạn là trợ lý TravelConnectVN. Hãy tư vấn dựa trên các tour này nếu có thể:\n${toursContext}`;
      
      const response = await this.client.models.generateContent({
        model: 'gemini-flash-latest', 
        contents: `${systemInstruction}\n\nNgười dùng hỏi: ${content}`,
      });

      const aiResponseText = response.text || 'Xin lỗi, tôi gặp chút gián đoạn trong việc phản hồi.';

      // 4. Lưu phản hồi AI
      const aiMessage = await this.prisma.ai_chat_messages.create({
        data: {
          session_id: sessionId,
          sender_type: 'assistant',
          content: aiResponseText,
          model_name: 'gemini-flash-latest',
        },
      });

      // 5. Cập nhật session
      await this.prisma.ai_chat_sessions.update({
        where: { id: sessionId },
        data: { last_interaction_at: new Date() },
      });

      return aiMessage;
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      // Trả về lỗi chi tiết để dễ debug nếu Key vẫn sai
      throw new InternalServerErrorException(`Lỗi AI: ${error.message || 'Không xác định'}`);
    }
  }
}
