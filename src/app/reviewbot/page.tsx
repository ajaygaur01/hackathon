import FileUploader from '@/components/FileUploader';

export default function Home() {
  return (
    <main className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Code for Review</h1>
      <FileUploader />
    </main>
  );
}
