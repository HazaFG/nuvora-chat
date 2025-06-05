import ChatTemplate from "@/components/ChatTemplate"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params

  return (<>
    <div className="p-4 sm:ml-64 h-screen">
      <div className="h-full">
        <ChatTemplate roomId={id} />
      </div>
    </div>
  </>
  )
}
