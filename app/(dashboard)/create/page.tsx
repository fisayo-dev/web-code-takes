import { CreateTakeForm } from "@/components/create-take-form"

export default function CreateTakePage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <h1 className="text-lg font-bold uppercase tracking-tight">Create a Take</h1>
      <CreateTakeForm />
    </div>
  )
}
