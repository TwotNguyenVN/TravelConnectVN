import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface AIModerationResult {
  isSafe: boolean;
  flags: string[];
  reason: string;
}

@Injectable()
export class AiModerationService {
  private readonly logger = new Logger(AiModerationService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY is not configured. AI Moderation will be disabled.',
      );
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'Bạn là một chuyên viên kiểm duyệt nội dung của hệ thống du lịch TravelConnect. Nhiệm vụ của bạn là phân tích tiêu đề và mô tả của tour/bài đăng để phát hiện vi phạm. Các lỗi vi phạm bao gồm: (1) Cố tình chèn thông tin liên lạc cá nhân (như Số điện thoại, Email, Zalo, Facebook, Link ngoài) để kéo khách ra ngoài hệ thống nhằm trốn phí, (2) Chứa ngôn từ thù địch, tục tĩu, (3) Lừa đảo. Hãy trả về kết quả dưới dạng một JSON hợp lệ và không có markdown. Cấu trúc yêu cầu: { "isSafe": boolean, "flags": string[], "reason": string }.',
    });
  }

  async analyzeContent(
    title: string,
    description: string,
  ): Promise<AIModerationResult> {
    if (!this.model) {
      this.logger.warn(
        'AI Moderation model is not initialized (missing API Key). Returning safe default.',
      );
      return { isSafe: true, flags: [], reason: 'AI disabled' };
    }

    const prompt = `Phân tích nội dung sau:\n\nTiêu đề: ${title}\n\nMô tả: ${description}\n\nLưu ý: Chỉ trả về JSON.`;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();

      // Dọn dẹp nếu mô hình trả về markdown dạng ```json ... ```
      const cleanedResponse = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanedResponse) as AIModerationResult;
      
      return {
        isSafe: parsed.isSafe ?? true,
        flags: parsed.flags ?? [],
        reason: parsed.reason ?? '',
      };
    } catch (error) {
      this.logger.error('Failed to analyze content using Gemini AI', error);
      // Fallback: để an toàn không chặn người dùng nếu AI lỗi
      return { isSafe: true, flags: [], reason: 'AI analysis failed' };
    }
  }
}
