import { User } from "@/components";

export default function ProfilePage() {
  return (
    <>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="bg-background text-foreground font-madimi">
            <User></User>
          </div>
        </div>
      </div>
    </>
  )
}

