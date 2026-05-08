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

    // 1. Lấy thông tin người dùng và phân quyền (Fix: Role nằm trong bảng user_roles)
    const user = await this.prisma.public_users.findUnique({
      where: { id: userId },
      select: { 
        full_name: true,
        user_roles_user_roles_user_idTousers: {
          select: { role_code: true }
        }
      }
    });

    const userRole = user?.user_roles_user_roles_user_idTousers[0]?.role_code || 'user';
    const userName = user?.full_name || 'Người dùng';

    // 2. Lấy ngữ cảnh dựa trên Role
    const systemInstruction = await this.getRoleBasedContext(userId, userRole, userName);

    // 3. Lưu tin nhắn người dùng
    await this.prisma.ai_chat_messages.create({
      data: {
        session_id: sessionId,
        sender_type: 'user',
        content,
      },
    });

    // 4. Gọi Gemini API với System Instruction chuẩn hóa
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-flash-latest', 
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          { role: 'user', parts: [{ text: `Câu hỏi hiện tại của tôi: ${content}` }] }
        ],
      });

      const aiResponseText = response.text || 'Xin lỗi, tôi gặp chút gián đoạn trong việc phản hồi.';

      // 5. Lưu phản hồi AI
      const aiMessage = await this.prisma.ai_chat_messages.create({
        data: {
          session_id: sessionId,
          sender_type: 'assistant',
          content: aiResponseText,
          model_name: 'gemini-flash-latest',
        },
      });

      // 6. Cập nhật session
      await this.prisma.ai_chat_sessions.update({
        where: { id: sessionId },
        data: { last_interaction_at: new Date() },
      });

      return aiMessage;
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new InternalServerErrorException(`Lỗi AI: ${error.message || 'Không xác định'}`);
    }
  }

  private async getRoleBasedContext(userId: string, role: string, userName: string): Promise<string> {
    // Base Prompt - Quy tắc chung cho AI
    let basePrompt = `Bạn là trợ lý ảo TravelConnectVN. Tên người dùng: ${userName}.
Hệ thống đang chạy vào lúc: ${new Date().toLocaleString('vi-VN')}.
QUY TẮC QUAN TRỌNG:
1. Luôn sử dụng Markdown để trình bày.
2. Nếu có danh sách dữ liệu (Tour, Báo cáo, Khách hàng), hãy sử dụng bảng (Table) hoặc danh sách có đánh số.
3. Luôn giữ phong cách phản hồi phù hợp với vai trò người dùng.

`;

    let roleSpecificPrompt = '';

    switch (role) {
      case 'SYSTEM_ADMIN':
        const adminContext = await this.fetchAdminContext();
        roleSpecificPrompt = `BẠN ĐANG HỖ TRỢ QUẢN TRỊ VIÊN. 
PHONG CÁCH: Ngắn gọn, số liệu chính xác, chuyên nghiệp. Không dùng emoji.

DỮ LIỆU HỆ THỐNG (24H QUA):
| Chỉ số | Số lượng |
| :--- | :--- |
| Người dùng mới | ${adminContext.stats.newUsers} |
| Tour mới tạo | ${adminContext.stats.newTours} |
| Đơn đặt tour mới | ${adminContext.stats.newBookings} |

BÁO CÁO VI PHẠM (CHƯA XỬ LÝ):
${adminContext.reports}

YÊU CẦU XÁC THỰC GUIDE ĐANG CHỜ:
${adminContext.verifications}

Nhiệm vụ: Cung cấp thông tin nhanh để Admin ra quyết định. Nếu không có gì gấp, hãy tóm tắt ngắn gọn tình hình.`;
        break;

      case 'GUIDE':
        const guideContext = await this.fetchGuideContext(userId);
        const publicContext = await this.fetchUserContext();
        roleSpecificPrompt = `BẠN ĐANG HỖ TRỢ HƯỚNG DẪN VIÊN. 🤝
PHONG CÁCH: Thân thiện, hỗ trợ, tập trung vào công việc quản lý.

DANH SÁCH TOUR CỦA BẠN:
${guideContext.myTours}

KHÁCH KHỞI HÀNH HÔM NAY:
${guideContext.todayStats}

YÊU CẦU ĐẶT TOUR MỚI (PENDING):
${guideContext.pendingRequests}

---
DỮ LIỆU CÔNG KHAI TRÊN HỆ THỐNG (Để bạn nắm bắt nhu cầu khách):
BÀI ĐĂNG TÌM BẠN ĐỒNG HÀNH MỚI NHẤT:
${publicContext.companions}

Nhiệm vụ: Giúp Guide nắm bắt lịch trình cá nhân VÀ các bài đăng tìm bạn của khách hàng. Nếu khách hỏi về bài đăng tìm bạn, hãy sử dụng danh sách trên.`;
        break;

      default: // user
        const userContext = await this.fetchUserContext();
        roleSpecificPrompt = `BẠN ĐANG HỖ TRỢ KHÁCH DU LỊCH. ✈️🏖️
PHONG CÁCH: Truyền cảm hứng, nhiệt tình, tư vấn chuyên sâu. Sử dụng emoji phù hợp.

GỢI Ý TOUR NỔI BẬT DÀNH CHO BẠN:
${userContext.tours}

BẠN ĐỒNG HÀNH ĐANG TÌM KIẾM:
${userContext.companions}

Nhiệm vụ: Giúp người dùng lên kế hoạch chuyến đi. Nếu họ hỏi về một nơi, hãy giới thiệu các Tour hoặc Bạn đồng hành liên quan từ danh sách trên.`;
        break;
    }

    return basePrompt + roleSpecificPrompt;
  }

  private async fetchUserContext() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tours = await this.prisma.tours.findMany({
      where: { 
        visibility_status: 'visible', 
        business_status: 'published', 
        deleted_at: null,
        start_date: { gte: today }
      },
      select: { title: true, province: true, price: true, start_date: true },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const companions = await this.prisma.companion_posts.findMany({
      where: { 
        visibility_status: 'visible', 
        business_status: 'open', 
        deleted_at: null,
        start_date: { gte: today }
      },
      select: { title: true, destination: true, start_date: true, expected_members: true },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const toursText = tours.length > 0 
      ? `| Tour | Địa điểm | Giá | Khởi hành |
| :--- | :--- | :--- | :--- |
` + tours.map(t => `| ${t.title} | ${t.province} | ${Number(t.price).toLocaleString()}đ | ${t.start_date ? t.start_date.toLocaleDateString('vi-VN') : 'Liên hệ'} |`).join('\n')
      : 'Hiện chưa có tour mới.';

    const companionsText = companions.length > 0
      ? `| Chủ đề | Điểm đến | Ngày đi | Cần thêm |
| :--- | :--- | :--- | :--- |
` + companions.map(c => `| ${c.title} | ${c.destination} | ${c.start_date.toLocaleDateString('vi-VN')} | ${c.expected_members} người |`).join('\n')
      : 'Hiện chưa có bài đăng tìm bạn đồng hành mới.';

    return { tours: toursText, companions: companionsText };
  }

  private async fetchGuideContext(userId: string) {
    const profile = await this.prisma.guide_profiles.findUnique({ where: { user_id: userId } });
    if (!profile) return { myTours: 'Không tìm thấy hồ sơ.', todayStats: 'Không có dữ liệu.', pendingRequests: 'Không có dữ liệu.' };

    const tours = await this.prisma.tours.findMany({
      where: { guide_profile_id: profile.id, deleted_at: null },
      select: { id: true, title: true, province: true, business_status: true }
    });
    const tourIds = tours.map(t => t.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayRequests = await this.prisma.tour_requests.findMany({
      where: { tour_id: { in: tourIds }, status: { in: ['approved', 'paid'] }, tours: { start_date: { gte: today, lt: tomorrow } } },
      include: { users_tour_requests_user_idTousers: { select: { full_name: true } }, tours: { select: { title: true } } }
    });

    const pendingRequests = await this.prisma.tour_requests.findMany({
      where: { tour_id: { in: tourIds }, status: 'pending' },
      include: { users_tour_requests_user_idTousers: { select: { full_name: true } }, tours: { select: { title: true } } },
      take: 5
    });

    const myToursText = tours.length > 0
      ? `| Tên Tour | Khu vực | Trạng thái |
| :--- | :--- | :--- |
` + tours.map(t => `| ${t.title} | ${t.province} | ${t.business_status} |`).join('\n')
      : 'Bạn chưa tạo tour nào.';

    const todayStatsText = todayRequests.length > 0
      ? `| Tên Khách | Tour | Số lượng |
| :--- | :--- | :--- |
` + todayRequests.map(r => `| ${r.users_tour_requests_user_idTousers.full_name} | ${r.tours.title} | ${r.participant_count} |`).join('\n')
      : 'Không có khách khởi hành hôm nay.';

    const pendingText = pendingRequests.length > 0
      ? `| Người gửi | Tour yêu cầu | Số người |
| :--- | :--- | :--- |
` + pendingRequests.map(r => `| ${r.users_tour_requests_user_idTousers.full_name} | ${r.tours.title} | ${r.participant_count} |`).join('\n')
      : 'Không có yêu cầu mới.';

    return { myTours: myToursText, todayStats: todayStatsText, pendingRequests: pendingText };
  }

  private async fetchAdminContext() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [newUsers, newTours, newBookings] = await Promise.all([
      this.prisma.public_users.count({ where: { created_at: { gte: twentyFourHoursAgo } } }),
      this.prisma.tours.count({ where: { created_at: { gte: twentyFourHoursAgo } } }),
      this.prisma.tour_requests.count({ where: { created_at: { gte: twentyFourHoursAgo } } })
    ]);

    const reports = await this.prisma.reports.findMany({
      where: { status: 'open' },
      select: { target_type: true, reason: true, created_at: true },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const verifications = await this.prisma.guide_verification_requests.findMany({
      where: { status: 'pending' },
      include: { guide_profiles: { include: { users: { select: { full_name: true } } } } },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const reportsText = reports.length > 0
      ? `| Loại | Lý do | Ngày gửi |
| :--- | :--- | :--- |
` + reports.map(r => `| ${r.target_type} | ${r.reason} | ${r.created_at.toLocaleDateString('vi-VN')} |`).join('\n')
      : 'Không có báo cáo vi phạm mới.';

    const verificationsText = verifications.length > 0
      ? `| Tên Guide | Ngày gửi |
| :--- | :--- | :--- |
` + verifications.map(v => `| ${v.guide_profiles.users.full_name} | ${v.created_at.toLocaleDateString('vi-VN')} |`).join('\n')
      : 'Không có yêu cầu xác thực mới.';

    return { stats: { newUsers, newTours, newBookings }, reports: reportsText, verifications: verificationsText };
  }
}
