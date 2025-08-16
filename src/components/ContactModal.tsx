import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactModal = ({ open, onOpenChange }: ContactModalProps) => {
  const whatsappNumber = "+34600013960";
  const email = "info@silverbacktreatment.se";

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}`, '_blank');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient">
            Contact Us
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Get in touch with our team for any questions or support.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-3 h-12 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
          >
            <MessageCircle className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">WhatsApp</div>
              <div className="text-sm opacity-90">{whatsappNumber}</div>
            </div>
          </Button>

          <Button
            onClick={handleEmailClick}
            variant="outline"
            className="flex items-center justify-center gap-3 h-12 border-primary/20 hover:border-primary"
          >
            <Mail className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Email</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};