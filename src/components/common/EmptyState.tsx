import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon ? (
        <div className="p-4 bg-[#E8F5E9] rounded-2xl mb-4 text-[#2E7D5B]">{icon}</div>
      ) : (
        <div className="p-4 bg-[#E8F5E9] rounded-2xl mb-4">
          <svg className="size-8 text-[#2E7D5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-[#17221D] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#66736D] max-w-sm">{description}</p>}
      {action && (
        <div className="mt-4">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}
