interface CategoryHeaderProps {
  title: string;
  totalCount: number;
}

export default function CategoryHeader({ title, totalCount }: CategoryHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-black mb-2">{title}</h1>
      {totalCount > 0 && (
        <p className="text-gray-600">{totalCount} products</p>
      )}
    </div>
  );
}