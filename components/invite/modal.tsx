"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function InviteModal({
  open,
  setOpen,
  username,
  initInviteCode,
  updateInviteCode,
  loading,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  username: string;
  initInviteCode: string;
  updateInviteCode: (invite_code: string) => void;
  loading: boolean;
}) {
  const t = useTranslations();
  const [inviteCode, setInviteCode] = useState(initInviteCode);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("my_invites.update_invite_code")}</DialogTitle>
          <DialogDescription>
            {t("my_invites.update_invite_code_tip")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Input
              placeholder={`${username}`}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => updateInviteCode(inviteCode)}
            disabled={loading}
          >
            {t("my_invites.update_invite_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
