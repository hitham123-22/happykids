import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.jpg";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)} aria-label="Happy Kids">
      <img
        src={logo}
        alt="شعار Happy Kids لملابس الرضع والأطفال"
        width={160}
        height={160}
        className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
      />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-extrabold sm:text-lg">Happy Kids</span>
        <span className="text-[10px] tracking-widest text-muted-foreground sm:text-[11px]">
          BABY &amp; KIDS WEAR
        </span>
      </span>
    </Link>
  );
}
