interface CategoryHeaderProps {
  title: string;
}

export default function CategoryHeader({ title }: CategoryHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl uppercase font-bold">{title}</h1>
    </div>
  );
}
