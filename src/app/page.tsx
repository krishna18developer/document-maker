import { CertificateProvider } from "@/context/certificate-context";
import { CertificateCanvas } from "@/components/certificate/certificate-canvas";
import { CertificateUploader } from "@/components/certificate/certificate-uploader";
import { CSVUploader } from "@/components/csv/csv-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CSVFieldSelector } from "@/components/csv/csv-field-selector";
import { PreviewSelector } from "@/components/csv/preview-selector";

export default function Home() {
  return (
    <CertificateProvider>
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Certificate Generator</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <CertificateCanvas />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Template</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <CertificateUploader />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSV Data Import</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] overflow-auto">
              <CSVUploader />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Fields</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px] overflow-auto">
              <div className="space-y-4">
                <CSVFieldSelector />
                <PreviewSelector />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </CertificateProvider>
  );
}
