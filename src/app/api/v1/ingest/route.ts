import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const ingestSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  totalRevenue: z.number().min(0),
  totalExpenses: z.number().min(0),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 });
    }

    // Authenticate the API key
    const business = await prisma.businessModule.findUnique({
      where: { apiKey },
    });

    if (!business || !business.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive API key' }, { status: 401 });
    }

    const body = await request.json();
    const result = ingestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: result.error.format() },
        { status: 400 }
      );
    }

    const { date, totalRevenue, totalExpenses, metadata } = result.data;
    const netProfit = totalRevenue - totalExpenses;
    
    // Normalize date to remove time portion for the unique constraint
    const recordDate = new Date(date);
    recordDate.setUTCHours(0, 0, 0, 0);

    // Upsert the financial summary
    const summary = await prisma.dailyFinancialSummary.upsert({
      where: {
        businessId_date: {
          businessId: business.id,
          date: recordDate,
        },
      },
      update: {
        totalRevenue,
        totalExpenses,
        netProfit,
        metadata: metadata ?? {},
      },
      create: {
        businessId: business.id,
        date: recordDate,
        totalRevenue,
        totalExpenses,
        netProfit,
        metadata: metadata ?? {},
      },
    });

    return NextResponse.json({
      message: 'Financial data ingested successfully',
      summaryId: summary.id,
    });
  } catch (error) {
    console.error('Ingest API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
