import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/features/user/atoms/current-user-atom.ts";
import { Properties } from "posthog-js";

export function PosthogUser() {
  const posthog = usePostHog();
  const [currentUser] = useAtom(currentUserAtom);

  useEffect(() => {
    if (currentUser) {
      const user = currentUser?.user;
      const workspace = currentUser?.workspace;
      if (!user || !workspace) return;

      posthog?.identify(user.id, {
        name: user.name,
        email: user.email,
        workspaceId: user.workspaceId,
        workspaceHostname: workspace.hostname,
        lastActiveAt: new Date().toISOString(),
        createdAt: user.createdAt,
        source: "midyAI-notes",
      } as Properties);
      posthog?.group("workspace", workspace.id, {
        name: workspace.name,
        hostname: workspace.hostname,
        plan: workspace?.plan,
        status: workspace.status,
        isOnTrial: !!workspace.trialEndAt,
        hasStripeCustomerId: !!workspace.stripeCustomerId,
        memberCount: workspace.memberCount,
        lastActiveAt: new Date().toISOString(),
        createdAt: workspace.createdAt,
        source: "midyAI-notes",
      } as Properties);
    }
  }, [posthog, currentUser]);

  return null;
}
