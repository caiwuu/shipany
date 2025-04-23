"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Icon from "@/components/icon";
import InviteModal from "./modal";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";

export default function Invite({ summary }: { summary: any }) {
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const { user, setUser } = useAppContext();
  const [loading, setLoading] = useState(false);

  const updateInviteCode = async function (invite_code: string) {
    try {
      invite_code = invite_code.trim();

      if (!invite_code) {
        toast.error("invite code is required");
        return;
      }

      setLoading(true);
      const req = {
        invite_code,
      };
      const resp = await fetch("/api/update-invite-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!resp.ok) {
        throw new Error("update invite code faild with status " + resp.status);
      }

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      setUser(data);
      toast.success("set invite code success");
      setOpen(false);
    } catch (e) {
      console.log("update invite code failed", e);
      toast.error("set invite code failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-wrap gap-6">
      <Card className="flex-1 p-6">
        <h2 className="text-sm text-gray-500 mb-4">
          {t("my_invites.invite_code")}
        </h2>
        {user && user.uuid && (
          <div className="flex items-center justify-between mb-4">
            <InviteModal
              open={open}
              setOpen={setOpen}
              username={user.nickname}
              initInviteCode={user.invite_code}
              updateInviteCode={updateInviteCode}
              loading={loading}
            />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {user.invite_code || "NOT SET"}
              </span>
              <Icon
                name="RiEditLine"
                className="text-primary text-xl cursor-pointer"
                onClick={() => setOpen(true)}
              />
            </div>
            {user.invite_code && (
              <CopyToClipboard
                text={`${process.env.NEXT_PUBLIC_WEB_URL}/i/${user?.invite_code}`}
                onCopy={() => toast.success("copied")}
              >
                <Button size="sm">{t("my_invites.copy_invite_link")}</Button>
              </CopyToClipboard>
            )}
          </div>
        )}
        <p className="text-sm text-gray-500">{t("my_invites.invite_tip")}</p>
      </Card>

      {/* 右侧奖励卡片 */}
      <Card className="flex-1 p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-sm text-gray-500 mb-4">
              {t("my_invites.invite_balance")}
            </h2>
            <p className="text-4xl font-bold">${summary.total_reward / 100}</p>
          </div>
          {/* <Button className="" size="sm">
            奖励提现
          </Button> */}
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold">{summary.total_invited}</p>
            <p className="text-sm text-gray-500">
              {t("my_invites.total_invite_count")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold">{summary.total_paid}</p>
            <p className="text-sm text-gray-500">
              {t("my_invites.total_paid_count")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold">${summary.total_reward / 100}</p>
            <p className="text-sm text-gray-500">
              {t("my_invites.total_award_amount")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
