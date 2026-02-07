import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  Flag,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useMarketplaceSettings,
  useMarketplaceSettingsMutations,
  useFeeRules,
  useFeeRuleMutations,
  useFeatureFlags,
  useFeatureFlagMutations,
} from '@/hooks/use-config'
import type { FeeRule } from '@/types/config'

export function MarketplaceSettingsPage() {
  const { data: settings, isLoading: settingsLoading } = useMarketplaceSettings()
  const settingsMutations = useMarketplaceSettingsMutations()
  const { data: feeRules = [], isLoading: feesLoading } = useFeeRules()
  const feeMutations = useFeeRuleMutations()
  const { data: featureFlags = [], isLoading: flagsLoading } = useFeatureFlags()
  const flagMutations = useFeatureFlagMutations()

  const [siteForm, setSiteForm] = useState({
    siteName: '',
    currency: 'USD',
  })
  const [feeDialogOpen, setFeeDialogOpen] = useState(false)
  const [editingFee, setEditingFee] = useState<FeeRule | null>(null)
  const [deletingFee, setDeletingFee] = useState<FeeRule | null>(null)
  const [feeForm, setFeeForm] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'tiered',
    value: 0,
    appliesTo: 'transaction' as 'listing' | 'transaction' | 'subscription',
    isActive: true,
  })

  useEffect(() => {
    if (settings?.siteName) {
      setSiteForm({
        siteName: settings.siteName,
        currency: settings.currency,
      })
    }
  }, [settings?.siteName, settings?.currency])

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await settingsMutations.update(siteForm)
    } catch {
      // Handled by mutation
    }
  }

  const handleFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingFee) {
        await feeMutations.update(editingFee.id, feeForm)
      } else {
        await feeMutations.create(feeForm)
      }
      setFeeDialogOpen(false)
      setEditingFee(null)
      setFeeForm({
        name: '',
        type: 'percentage',
        value: 0,
        appliesTo: 'transaction',
        isActive: true,
      })
    } catch {
      // Handled by mutation
    }
  }

  const handleEditFee = (fee: FeeRule) => {
    setEditingFee(fee)
    setFeeForm({
      name: fee.name,
      type: fee.type,
      value: fee.value,
      appliesTo: fee.appliesTo ?? 'transaction',
      isActive: fee.isActive,
    })
    setFeeDialogOpen(true)
  }

  const handleAddFee = () => {
    setEditingFee(null)
    setFeeForm({
      name: '',
      type: 'percentage',
      value: 0,
      appliesTo: 'transaction',
      isActive: true,
    })
    setFeeDialogOpen(true)
  }

  const handleToggleFlag = async (id: string, isEnabled: boolean) => {
    try {
      await flagMutations.update(id, { isEnabled })
    } catch {
      // Handled by mutation
    }
  }

  const handleDeleteFee = async () => {
    if (!deletingFee) return
    try {
      await feeMutations.remove(deletingFee.id)
      setDeletingFee(null)
    } catch {
      // Handled by mutation
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          to="/dashboard/admin"
          className="transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to="/dashboard/admin/config"
          className="transition-colors hover:text-foreground"
        >
          Configuration
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Marketplace Settings</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Marketplace Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Update category taxonomy, listing fields, fees, and feature flags
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="flags">Feature Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Site name and currency
              </p>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              ) : (
                <form onSubmit={handleSaveSite} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteForm.siteName}
                      onChange={(e) =>
                        setSiteForm((p) => ({
                          ...p,
                          siteName: e.target.value,
                        }))
                      }
                      placeholder="Marketplace"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={siteForm.currency}
                      onValueChange={(v) =>
                        setSiteForm((p) => ({ ...p, currency: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={settingsMutations.isPending}
                  >
                    Save Settings
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Fee Rules
                </CardTitle>
                <Button onClick={handleAddFee} disabled={feeMutations.isPending}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Fee
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform fees and commissions
              </p>
            </CardHeader>
            <CardContent>
              {feesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : feeRules.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 font-medium text-foreground">
                    No fee rules
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add fee rules for listings and transactions
                  </p>
                  <Button className="mt-4" onClick={handleAddFee}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Fee
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Applies To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeRules.map((fee) => (
                        <TableRow
                          key={fee.id}
                          className="transition-colors hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">{fee.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{fee.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {fee.type === 'percentage'
                              ? `${fee.value}%`
                              : `$${fee.value.toFixed(2)}`}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {fee.appliesTo ?? '—'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                fee.isActive ? 'success' : 'secondary'
                              }
                            >
                              {fee.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleEditFee(fee)}
                                aria-label="Edit fee"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeletingFee(fee)}
                                aria-label="Delete fee"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags">
          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Feature Flags
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Per-marketplace toggles and policies
              </p>
            </CardHeader>
            <CardContent>
              {flagsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : featureFlags.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
                  <Flag className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 font-medium text-foreground">
                    No feature flags
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Feature flags are configured by the system
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {featureFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{flag.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {flag.description ?? flag.key}
                        </p>
                      </div>
                      <Switch
                        checked={flag.isEnabled}
                        onCheckedChange={(v) =>
                          handleToggleFlag(flag.id, v)
                        }
                        disabled={flagMutations.isPending}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fee Create/Edit Dialog */}
      <Dialog open={feeDialogOpen} onOpenChange={setFeeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFee ? 'Edit Fee Rule' : 'Add Fee Rule'}
            </DialogTitle>
            <DialogDescription>
              Configure platform fees for listings or transactions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFeeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feeName">Name</Label>
              <Input
                id="feeName"
                value={feeForm.name}
                onChange={(e) =>
                  setFeeForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Transaction Fee"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={feeForm.type}
                onValueChange={(v) =>
                  setFeeForm((p) => ({
                    ...p,
                    type: v as 'percentage' | 'fixed' | 'tiered',
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="tiered">Tiered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeValue">Value</Label>
              <Input
                id="feeValue"
                type="number"
                min={0}
                step={feeForm.type === 'percentage' ? 0.1 : 0.01}
                value={feeForm.value}
                onChange={(e) =>
                  setFeeForm((p) => ({
                    ...p,
                    value: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder={feeForm.type === 'percentage' ? '5' : '0.99'}
              />
            </div>
            <div className="space-y-2">
              <Label>Applies To</Label>
              <Select
                value={feeForm.appliesTo}
                onValueChange={(v) =>
                  setFeeForm((p) => ({
                    ...p,
                    appliesTo: v as
                      | 'listing'
                      | 'transaction'
                      | 'subscription',
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="feeActive">Active</Label>
              <Switch
                id="feeActive"
                checked={feeForm.isActive}
                onCheckedChange={(v) =>
                  setFeeForm((p) => ({ ...p, isActive: v }))
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFeeDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={feeMutations.isPending}>
                {editingFee ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete fee confirmation */}
      <AlertDialog open={!!deletingFee} onOpenChange={() => setDeletingFee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete fee rule?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingFee &&
                `This will permanently remove "${deletingFee.name}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
