interface CategoryHeaderProps {
  title: string;
  totalCount: number;
}

export default function CategoryHeader({
  title,
  totalCount,
}: CategoryHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-3xl uppercase font-bold mb-4">{title}</h1>
      {totalCount > 0 && (
        <p>
          <span className="font-bold">{totalCount}</span> products
        </p>
      )}
    </div>
  );
}
