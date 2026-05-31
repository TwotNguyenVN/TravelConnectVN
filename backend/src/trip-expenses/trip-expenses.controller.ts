import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { TripExpensesService } from './trip-expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { SettleExpenseDto } from './dto/settle-expense.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('trip-expenses')
@Controller('companion-posts/:postId/expenses')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TripExpensesController {
  constructor(private readonly tripExpensesService: TripExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chi tiêu và bảng quyết toán nợ' })
  async getExpenses(@Request() req, @Param('postId') postId: string) {
    const userId = req.user.id;
    return this.tripExpensesService.getExpenses(userId, postId);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm khoản chi tiêu mới cho nhóm' })
  async createExpense(
    @Request() req,
    @Param('postId') postId: string,
    @Body() data: CreateExpenseDto,
  ) {
    const userId = req.user.id;
    return this.tripExpensesService.createExpense(userId, postId, data);
  }

  @Delete(':expenseId')
  @ApiOperation({ summary: 'Xóa một khoản chi tiêu' })
  async deleteExpense(
    @Request() req,
    @Param('postId') postId: string,
    @Param('expenseId') expenseId: string,
  ) {
    const userId = req.user.id;
    return this.tripExpensesService.deleteExpense(userId, postId, expenseId);
  }

  @Post('settle')
  @ApiOperation({ summary: 'Quyết toán nợ chéo giữa hai thành viên' })
  async settleDebts(
    @Request() req,
    @Param('postId') postId: string,
    @Body() data: SettleExpenseDto,
  ) {
    const userId = req.user.id;
    return this.tripExpensesService.settleDebts(userId, postId, data);
  }

  @Put('bank')
  @ApiOperation({ summary: 'Cập nhật tài khoản ngân hàng nhận tiền của tôi' })
  async updateMyBank(
    @Request() req,
    @Body() data: UpdateBankDto,
  ) {
    const userId = req.user.id;
    return this.tripExpensesService.updateMyBank(userId, data);
  }
}
