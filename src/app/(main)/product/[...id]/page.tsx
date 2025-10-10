interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  await new Promise((res, rej) => {
    setTimeout(() => {
      res("resolved");
    }, 2000);
  });
  return <div>product id: {id}</div>;
}
