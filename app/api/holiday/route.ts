/**
 * 节假日查询 API
 * GET /api/holiday?year=2024
 * 从 timor.tech 获取中国节假日数据
 * 用于日历组件显示节假日信息
 */
import { NextResponse } from 'next/server';

/**
 * 获取指定年份的节假日数据
 * @param request - 包含 year 查询参数的请求
 * @returns 节假日和工作日数据
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || new Date().getFullYear();
  
  try {
    // 从 timor.tech API 获取节假日数据
    const response = await fetch(`https://timor.tech/api/holiday/year/${year}`);
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      year: year,
      holidays: data.holiday || {},  // 节假日数据
      workdays: data.workday || {}   // 调休工作日数据
    });
  } catch (error) {
    console.error('Failed to fetch holiday data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch holiday data' },
      { status: 500 }
    );
  }
}
