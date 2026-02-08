'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { instance } from '@/hooks/api';

const formatDateTime = (value) => {
	if (!value) return '-';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '-';
	return date.toLocaleString('uz-UZ');
};

const getStatusLabel = (status) => {
	switch (status) {
		case 'completed':
			return 'Yakunlangan';
		case 'pending':
			return 'Jarayonda';
		case 'cancelled':
			return 'Bekor qilingan';
		default:
			return status || '-';
	}
};

const ResultDetailPage = () => {
	const params = useParams();
	const examId = params?.examId;
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDetail = async () => {
			if (!examId) return;
			setLoading(true);
			setError(null);
			try {
				const response = await instance.get(`/api/final-exam/${examId}`);
				setData(response.data);
			} catch (err) {
				console.error(err);
				setError(err?.response?.data?.message || 'Imtihon natijasini olishda xatolik yuz berdi.');
			} finally {
				setLoading(false);
			}
		};

		void fetchDetail();
	}, [examId]);

	const stats = useMemo(() => ({
		correct: data?.exam?.correctCount ?? 0,
		wrong: data?.exam?.wrongCount ?? 0,
		percentage: data?.exam?.percentage ?? '0',
		total: data?.exam?.totalQuestions ?? 0,
	}), [data]);

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 p-3 md:p-12">
				<div className="space-y-4 animate-pulse">
					<div className="h-10 w-64 rounded-xl bg-slate-200 dark:bg-slate-700" />
					<div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-700" />
					<div className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-700" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] dark:bg-slate-900 p-6 text-center">
				<div className="bg-white dark:bg-slate-800 rounded-[32px] border border-red-100 dark:border-red-900 shadow-2xl p-10 max-w-md">
					<AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Xatolik</h2>
					<p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
					<Link href="/exam" className="inline-block w-full py-3 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white font-bold uppercase tracking-widest">
						Orqaga qaytish
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 py-6 px-3 md:px-12">
			<div className="space-y-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Imtihon #{data?.exam?.id} natijasi</h1>
					<Link href="/exam" className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-sm font-black uppercase tracking-wide">
						Tarixga qaytish
					</Link>
				</div>

				<div className="bg-white dark:bg-slate-800 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-6">
					<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
						<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4"><p className="text-[11px] text-slate-400 font-black uppercase">Holat</p><p className="text-lg font-black text-slate-900 dark:text-white">{getStatusLabel(data?.exam?.status)}</p></div>
						<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4"><p className="text-[11px] text-slate-400 font-black uppercase">To&apos;g&apos;ri</p><p className="text-lg font-black text-slate-900 dark:text-white">{stats.correct}</p></div>
						<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4"><p className="text-[11px] text-slate-400 font-black uppercase">Noto&apos;g&apos;ri</p><p className="text-lg font-black text-slate-900 dark:text-white">{stats.wrong}</p></div>
						<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4"><p className="text-[11px] text-slate-400 font-black uppercase">Jami</p><p className="text-lg font-black text-slate-900 dark:text-white">{stats.total}</p></div>
						<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4"><p className="text-[11px] text-slate-400 font-black uppercase">Foiz</p><p className="text-lg font-black text-slate-900 dark:text-white">{stats.percentage}%</p></div>
					</div>
					<p className="text-xs text-slate-500 dark:text-slate-400 mt-4">Boshlangan: {formatDateTime(data?.exam?.startedAt)} | Tugagan: {formatDateTime(data?.exam?.completedAt)}</p>
				</div>

				<div className="space-y-3">
					{data?.questions?.map((item, index) => {
						const userAnswerIndex = typeof item?.userAnswer === 'number' ? item.userAnswer : null;
						const correctAnswerIndex = item?.question?.correctOption;
						const userAnswerText = userAnswerIndex === null ? 'Javob berilmagan' : (item?.question?.options?.[userAnswerIndex] || userAnswerIndex);
						const correctAnswerText = typeof correctAnswerIndex === 'number'
							? (item?.question?.options?.[correctAnswerIndex] || correctAnswerIndex)
							: '-';

						return (
							<div key={item?.question?.id} className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-6">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="space-y-2 flex-1 min-w-[260px]">
										<p className="text-xs font-black tracking-[0.2em] uppercase text-blue-600">Savol {index + 1}</p>
										<p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{item?.question?.questionText}</p>
									</div>
									<span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${item?.isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
										{item?.isCorrect ? "To'g'ri" : "Noto'g'ri"}
									</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
									<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
										<p className="text-[11px] font-black uppercase text-slate-400">Sizning javobingiz</p>
										<p className="text-sm mt-1 text-slate-700 dark:text-slate-200">{userAnswerText}</p>
									</div>
									<div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4">
										<p className="text-[11px] font-black uppercase text-slate-400">To&apos;g&apos;ri javob</p>
										<p className="text-sm mt-1 text-slate-700 dark:text-slate-200">{correctAnswerText}</p>
									</div>
								</div>

								{item?.question?.explanation && (
									<div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
										<p className="text-[11px] font-black uppercase text-slate-400">Izoh</p>
										<p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{item.question.explanation}</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default ResultDetailPage;
