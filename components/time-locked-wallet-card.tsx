"use client";

import React, { useState } from "react";
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
import { useTimelockWallet } from "@/hook/use-timelock-wallet";
import { useWallet } from "@solana/wallet-adapter-react";
import { MINIMUM_AMOUNTS } from "@/lib/constants";

export default function TimeLockedWalletCard() {
  const { publicKey } = useWallet();
  const { createSollock, createTokenLock, loading, error, clearError } =
    useTimelockWallet();

  // Form state
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"SOL" | "USDC">("SOL");
  const [lockDuration, setLockDuration] = useState("");
  const [durationType, setDurationType] = useState<
    "minutes" | "hours" | "days" | "weeks" | "months"
  >("days");

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

  const handleCreateLock = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const numAmount = parseFloat(amount);
    const numDuration = parseInt(lockDuration);

    if (isNaN(numAmount) || isNaN(numDuration)) {
      alert("Please enter valid amount and duration");
      return;
    }

    // Validate minimum amount
    const minAmount =
      token === "SOL" ? MINIMUM_AMOUNTS.SOL : MINIMUM_AMOUNTS.USDC;
    if (numAmount < minAmount) {
      alert(`Minimum amount for ${token} is ${minAmount}`);
      return;
    }

    try {
      console.log("Creating timelock with:", {
        amount: numAmount,
        duration: numDuration,
        durationType,
        token,
        publicKey: publicKey.toString(),
      });

      if (token === "SOL") {
        const result = await createSollock(
          numAmount,
          numDuration,
          durationType
        );
        if (result) {
          console.log("SOL timelock created successfully:", result);
          alert(
            `SOL timelock created successfully! Account: ${result.timelockAccount}\nSignature: ${result.signature}`
          );
          // Reset form
          setAmount("");
          setLockDuration("");
        } else {
          alert("Failed to create SOL timelock");
        }
      } else {
        const result = await createTokenLock(
          numAmount,
          numDuration,
          durationType,
          "USDC"
        );
        if (result) {
          console.log("USDC timelock created successfully:", result);
          alert(
            `USDC timelock created successfully! Account: ${result.timelockAccount}`
          );
          // Reset form
          setAmount("");
          setLockDuration("");
        } else {
          alert("Failed to create USDC timelock");
        }
      }
    } catch (err) {
      console.error("Failed to create timelock:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(`Error creating timelock: ${errorMessage}`);
    }
  };

  const isFormValid =
    amount &&
    lockDuration &&
    parseFloat(amount) > 0 &&
    parseInt(lockDuration) > 0;

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
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="ml-2"
                >
                  ✕
                </Button>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="font-mono w-full"
                  min={
                    token === "SOL" ? MINIMUM_AMOUNTS.SOL : MINIMUM_AMOUNTS.USDC
                  }
                  step="0.001"
                />
                <p className="text-xs text-muted-foreground">
                  Min:{" "}
                  {token === "SOL" ? MINIMUM_AMOUNTS.SOL : MINIMUM_AMOUNTS.USDC}{" "}
                  {token}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Select
                  value={token}
                  onValueChange={(value: "SOL" | "USDC") => setToken(value)}
                >
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
                  value={lockDuration}
                  onChange={(e) => setLockDuration(e.target.value)}
                  className="w-full"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration-type">Duration Type</Label>
                <Select
                  value={durationType}
                  onValueChange={(value: any) => setDurationType(value)}
                >
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

            <Button
              onClick={handleCreateLock}
              disabled={!isFormValid || loading || !publicKey}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Create Time Lock
                </>
              )}
            </Button>

            {!publicKey && (
              <p className="text-center text-sm text-muted-foreground">
                Connect your wallet to create a timelock
              </p>
            )}
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
            {!publicKey ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Connect your wallet to view locked funds</p>
              </div>
            ) : (
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
                            <Badge
                              variant={isUnlocked ? "default" : "secondary"}
                            >
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
                            Unlock Date:{" "}
                            {wallet.unlockDate.toLocaleDateString()} at{" "}
                            {wallet.unlockDate.toLocaleTimeString()}
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
            )}
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
