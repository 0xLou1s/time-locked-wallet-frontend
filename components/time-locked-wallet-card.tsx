import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Clock, Lock, Unlock, Wallet, Timer } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function TimeLockedWalletCard() {
  // Mock data for UI display only
  const mockLockedWallets = [
    {
      id: 1,
      amount: "10.5",
      token: "SOL",
      unlockDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    },
    {
      id: 2,
      amount: "1000",
      token: "USDC",
      unlockDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago (unlocked)
    },
  ];

  return (
    <main className="w-full">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Create Time Lock */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Create Time Lock
            </CardTitle>
            <CardDescription>
              Lock your SOL or USDC for a specified period. Funds will be secure
              and withdrawable only after the unlock date.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="font-mono w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Select defaultValue="SOL">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOL">SOL</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Lock Duration</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="1"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration-type">Duration Type</Label>
                <Select defaultValue="days">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" size="lg">
              <Lock className="h-4 w-4 mr-2" />
              Create Time Lock
            </Button>
          </CardContent>
        </Card>

        {/* Locked Wallets */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Your Locked Wallets
            </CardTitle>
            <CardDescription>
              View and manage your time-locked funds. Withdraw when the unlock
              period expires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLockedWallets.map((wallet, index) => {
                const isUnlocked = new Date() >= wallet.unlockDate;

                return (
                  <div key={wallet.id}>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="font-mono text-lg font-semibold">
                            {wallet.amount} {wallet.token}
                          </div>
                          <Badge variant={isUnlocked ? "default" : "secondary"}>
                            {isUnlocked ? (
                              <>
                                <Unlock className="h-3 w-3 mr-1" /> Unlocked
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 mr-1" /> Locked
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Unlock Date: {wallet.unlockDate.toLocaleDateString()}{" "}
                          at {wallet.unlockDate.toLocaleTimeString()}
                        </div>
                        {!isUnlocked && (
                          <div className="text-sm text-muted-foreground">
                            Time remaining: ~23 hours
                          </div>
                        )}
                      </div>

                      <Button
                        disabled={!isUnlocked}
                        variant={isUnlocked ? "default" : "secondary"}
                        size="sm"
                      >
                        {isUnlocked ? (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Withdraw
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Locked
                          </>
                        )}
                      </Button>
                    </div>
                    {index < mockLockedWallets.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-8 border-border">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Lock Funds</h3>
              <p className="text-sm text-muted-foreground">
                Deposit SOL or USDC into a secure time-locked account with your
                chosen unlock date.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Timer className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Wait Period</h3>
              <p className="text-sm text-muted-foreground">
                Your funds are safely stored on-chain. Track the countdown until
                your unlock date.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Unlock className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Withdraw</h3>
              <p className="text-sm text-muted-foreground">
                Once unlocked, withdraw your funds plus any earned rewards
                directly to your wallet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
