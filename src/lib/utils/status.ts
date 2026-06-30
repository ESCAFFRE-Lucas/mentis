export const STATUS_LABELS: Record<string, string> = {
	DRAFT: 'Brouillon',
	SUBMITTED: 'Soumis',
	UNDER_REVIEW: 'En révision',
	ACCEPTED: 'Accepté',
	REJECTED: 'Rejeté'
};

export const STATUS_COLORS: Record<string, string> = {
	DRAFT: 'bg-zinc-100 text-zinc-700',
	SUBMITTED: 'bg-blue-100 text-blue-700',
	UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
	ACCEPTED: 'bg-green-100 text-green-700',
	REJECTED: 'bg-red-100 text-red-700'
};

export const DECISION_LABELS: Record<string, string> = {
	ACCEPT: 'Accepté',
	REVISIONS: 'Révisions demandées',
	REJECT: 'Rejeté'
};

export const DECISION_COLORS: Record<string, string> = {
	ACCEPT: 'bg-green-100 text-green-700',
	REVISIONS: 'bg-yellow-100 text-yellow-700',
	REJECT: 'bg-red-100 text-red-700'
};
