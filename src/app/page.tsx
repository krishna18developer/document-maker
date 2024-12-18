import { CertificateUploader } from "@/components/certificate/certificate-uploader";
import { CSVUploader } from "@/components/csv/csv-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CertificateEditor } from "@/components/certificate/certificate-editor";

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Certificate Generator</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Template</CardTitle>
          </CardHeader>
          <CardContent>
            <CertificateUploader />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Data Import</CardTitle>
          </CardHeader>
          <CardContent>
            <CSVUploader />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Editor</CardTitle>
        </CardHeader>
        <CardContent>
          {/* We'll connect this to the CertificateUploader state later */}
          {/* <CertificateEditor templateUrl={templateUrl} /> */}
        </CardContent>
      </Card>
    </main>
  );
}
