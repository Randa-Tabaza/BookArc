import { useState } from "react";
import { Upload, User, CreditCard, Camera, X, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

interface BecomeAuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { fullName: string; idCard: File; selfie: File }) => void;
  verificationStatus?: null | "pending" | "approved" | "rejected";
}

export function BecomeAuthorDialog({
  open,
  onOpenChange,
  onSubmit,
  verificationStatus,
}: BecomeAuthorDialogProps) {
  const [fullName, setFullName] = useState("");
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string>("");
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string>("");

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setIdCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("ID card uploaded successfully");
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Selfie uploaded successfully");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!idCardFile) {
      toast.error("Please upload your ID card");
      return;
    }

    if (!selfieFile) {
      toast.error("Please upload a selfie");
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      idCard: idCardFile,
      selfie: selfieFile,
    });

    // Reset form
    setFullName("");
    setIdCardFile(null);
    setIdCardPreview("");
    setSelfieFile(null);
    setSelfiePreview("");
  };

  const handleClose = () => {
    // Reset form when closing
    setFullName("");
    setIdCardFile(null);
    setIdCardPreview("");
    setSelfieFile(null);
    setSelfiePreview("");
    onOpenChange(false);
  };

  const removeIdCard = () => {
    setIdCardFile(null);
    setIdCardPreview("");
  };

  const removeSelfie = () => {
    setSelfieFile(null);
    setSelfiePreview("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Become an Author</DialogTitle>
          <DialogDescription>
            {verificationStatus === "pending"
              ? "Your verification is being reviewed by our team."
              : "Start your journey as an author on BookArc. We need to verify your identity to ensure a safe and trusted community."}
          </DialogDescription>
        </DialogHeader>

        {verificationStatus === "pending" ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold">Pending Review</h3>
            <p className="text-center text-muted-foreground">
              We're reviewing your verification documents. This usually takes 1-2 business days.
              You'll receive a notification once your application has been reviewed.
            </p>
            <Button
              onClick={handleClose}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        ) : verificationStatus === "rejected" ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold">Verification Rejected</h3>
            <p className="text-center text-muted-foreground">
              Unfortunately, your verification was not approved. Please ensure your documents are clear
              and match the requirements, then try again.
            </p>
            <Button
              onClick={() => {
                // Reset the form to allow resubmission
                setFullName("");
                setIdCardFile(null);
                setIdCardPreview("");
                setSelfieFile(null);
                setSelfiePreview("");
              }}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full legal name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* ID Card Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                ID Card / Government-Issued ID
              </Label>
              {idCardPreview ? (
                <div className="relative">
                  <img
                    src={idCardPreview}
                    alt="ID Card Preview"
                    className="w-full h-48 object-cover rounded-md border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeIdCard}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="idCard"
                    accept="image/*"
                    onChange={handleIdCardUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="idCard"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload ID card
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Maximum file size: 5MB
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Selfie Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-muted-foreground" />
                Selfie Photo
              </Label>
              {selfiePreview ? (
                <div className="relative">
                  <img
                    src={selfiePreview}
                    alt="Selfie Preview"
                    className="w-full h-48 object-cover rounded-md border border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeSelfie}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-md p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="selfie"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="selfie"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload selfie
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Maximum file size: 5MB
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Verification
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}