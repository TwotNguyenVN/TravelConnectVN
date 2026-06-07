import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export interface ModerationResult {
  isFlagged: boolean;
  reason: string;
  confidenceScore: number;
}

@Injectable()
export class AiModerationService {
  private readonly logger = new Logger(AiModerationService.name);
  private client: GoogleGenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.client = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  /**
   * Phân tích văn bản để phát hiện các nội dung vi phạm
   * @param content Nội dung cần kiểm tra
   * @param contentType Loại nội dung (e.g., 'TOUR_DESCRIPTION', 'REVIEW', 'COMPANION_POST')
   */
  async analyzeContent(
    content: string,
    contentType: string,
  ): Promise<ModerationResult> {
    try {
      const prompt = `Bạn là một hệ thống kiểm duyệt nội dung tự động (Auto-Moderation) cho nền tảng du lịch TravelConnectVN.
Hãy phân tích nội dung sau đây (loại nội dung: ${contentType}) và xác định xem nó có vi phạm chính sách không.
Chính sách vi phạm bao gồm:
1. Ngôn từ độc hại, chửi thề, xúc phạm.
2. Nội dung lừa đảo, cờ bạc, quảng cáo spam, dịch vụ spa/massage trá hình.
3. Chứa thông tin cá nhân (SĐT, Email) nhằm lôi kéo khách hàng giao dịch ngoài nền tảng (nếu là Tour).

Nội dung cần phân tích:
"""
${content}
"""

TRẢ VỜI DƯỚI ĐỊNH DẠNG JSON CHÍNH XÁC NHƯ SAU (Không có markdown block \`\`\`json):
{
  "isFlagged": true/false,
  "reason": "Giải thích ngắn gọn lý do tại sao vi phạm (hoặc chuỗi rỗng nếu an toàn)",
  "confidenceScore": 0.0 to 1.0
}`;

      const response = await this.client.models.generateContent({
        model: 'gemini-flash-latest',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const responseText = response.text || '{}';
      const cleanJsonStr = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsedResult = JSON.parse(
        cleanJsonStr,
      ) as Partial<ModerationResult>;

      return {
        isFlagged: parsedResult.isFlagged === true,
        reason: parsedResult.reason || '',
        confidenceScore:
          typeof parsedResult.confidenceScore === 'number'
            ? parsedResult.confidenceScore
            : 1.0,
      };
    } catch (error) {
      this.logger.error('Error during AI Content Moderation', error);
      // Fail-safe: Nếu AI lỗi, không cắm cờ để tránh ảnh hưởng trải nghiệm người dùng
      return {
        isFlagged: false,
        reason: 'Lỗi kiểm duyệt tự động',
        confidenceScore: 0.0,
      };
    }
  }
}
