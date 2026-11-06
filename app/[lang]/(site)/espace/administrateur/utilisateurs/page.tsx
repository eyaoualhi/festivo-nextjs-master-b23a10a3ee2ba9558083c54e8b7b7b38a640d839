import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { requireRole } from "@/lib/dal";
import { connectDB } from "@/lib/db";
import { formatShortDate } from "@/lib/format";
import { localizePath } from "@/lib/i18n/config";
import { getDictionary, getI18n } from "@/lib/i18n/server";
import User, { type UserDocument } from "@/models/User";
import type { UserRole } from "@/types/user";
import SpaceSection from "@/app/[lang]/(site)/espace/_components/SpaceSection";
import SpaceSkeleton from "@/app/[lang]/(site)/espace/_components/SpaceSkeleton";
import UserRowActions from "./_components/UserRowActions";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.dashboard.admin.users.metaTitle };
}

export default async function AdminUsersPage() {
  const dict = await getDictionary();

  return (
    <Suspense fallback={<SpaceSkeleton label={dict.dashboard.loading} />}>
      <AdminUsersContent />
    </Suspense>
  );
}

async function AdminUsersContent() {
  const { locale, dict } = await getI18n();
  const currentUser = await requireRole(locale, "administrateur");
  const t = dict.dashboard.admin;

  await connectDB();
  const users = await User.find()
    .sort({ createdAt: -1 })
    .lean<(UserDocument & { _id: unknown; active?: boolean })[]>();

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Retour">
        <Link
          href={localizePath(locale, "/espace/administrateur")}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4 rtl:-scale-x-100" />
          {t.metaTitle}
        </Link>
      </nav>

      <SpaceSection id="admin-users-list" title={t.users.metaTitle}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs font-semibold tracking-wider text-muted uppercase">
              <tr>
                <th scope="col" className="pr-4 pb-3">
                  {t.users.name}
                </th>
                <th scope="col" className="pr-4 pb-3">
                  {t.users.email}
                </th>
                <th scope="col" className="pr-4 pb-3">
                  {t.users.role}
                </th>
                <th scope="col" className="pr-4 pb-3">
                  {t.users.since}
                </th>
                <th scope="col" className="pr-4 pb-3">
                  Statut
                </th>
                <th scope="col" className="pb-3 text-right">
                  {t.users.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => {
                const uId = String(u._id);
                const isSelf = uId === currentUser.id;
                const isActive = u.active !== false;

                return (
                  <tr key={uId} className="transition-colors hover:bg-surface/50">
                    <td className="py-3.5 pr-4 font-semibold text-ink">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                          <Users aria-hidden="true" className="size-4" />
                        </span>
                        <span dir="auto">
                          {u.name}
                          {isSelf && (
                            <span className="ml-1.5 rounded-sm bg-surface px-1.5 py-0.5 text-[10px] font-normal text-muted">
                              (vous)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-muted">{u.email}</td>
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-muted">
                      {formatShortDate(locale, u.createdAt)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          isActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                        }`}
                      >
                        {isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <UserRowActions
                        userId={uId}
                        currentRole={u.role as UserRole}
                        currentActive={isActive}
                        isSelf={isSelf}
                        labels={t.users}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SpaceSection>
    </div>
  );
}
