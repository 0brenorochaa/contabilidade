import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link, g as Outlet, p as useRouterState, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime, d as DialogContent, f as DialogDescription, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as todayIso, t as cn } from "./utils-WuDAn4c5.mjs";
import { o as INCOME_SOURCES } from "./constants-aV2RQtvO.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { S as ChartPie, _ as LayoutDashboard, c as Shield, f as Plus, h as LogOut, i as UserRound, n as Wallet, t as X, u as Settings, v as History, w as Bell, y as Flag } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as listNotifications, g as useTheme, s as getMe } from "./router-JxxwALvl.mjs";
import { t as BrandLink } from "./brand-B0N51Sly.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as useCurrentUserState } from "./use-current-user-Cfaybt7U.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { o as parseMoneyInput } from "./format-ByvtKy4h.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DtIctiK3.mjs";
import { c as listCategories, n as createCategory, r as createTransaction, s as listAccounts, u as updateTransaction } from "./finance-B8dL9te4.mjs";
import { t as useAppStore } from "./store-CEa72zWv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-CI-glAqA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
function SheetContent({ className, children, side = "bottom", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 bg-card text-card-foreground shadow-soft", side === "bottom" && "inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-xl border-t border-border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]", side === "right" && "inset-y-0 right-0 h-full w-full max-w-md overflow-y-auto border-l border-border p-5", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
			className: "absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100",
			"aria-label": "Fechar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 space-y-1 pr-8", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		className: cn("text-lg font-semibold", className),
		...props
	});
}
function SheetDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function TransactionSheet() {
	const open = useAppStore((s) => s.addOpen);
	const mode = useAppStore((s) => s.addMode);
	const editing = useAppStore((s) => s.editing);
	const closeAdd = useAppStore((s) => s.closeAdd);
	const openAdd = useAppStore((s) => s.openAdd);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange: (v) => v ? openAdd(mode) : closeAdd(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			side: "bottom",
			className: "md:mx-auto md:max-w-lg md:rounded-t-xl",
			children: !mode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Adicionar movimentação" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Escolha o tipo de registro." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: "outline",
					onClick: () => openAdd("expense"),
					children: "Nova despesa"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					onClick: () => openAdd("income"),
					children: "Nova receita"
				})]
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionForm, {
				type: mode,
				onCancel: closeAdd,
				editingId: editing?.id,
				defaults: editing ? {
					amount: String(editing.amount).replace(".", ","),
					description: editing.description,
					occurredOn: editing.occurredOn,
					place: editing.place ?? "",
					categoryId: editing.categoryId ?? "",
					accountId: editing.accountId ?? "",
					incomeSource: editing.incomeSource ?? "salario"
				} : void 0
			})
		})
	});
}
function TransactionForm({ type, onCancel, editingId, defaults }) {
	const qc = useQueryClient();
	const [amount, setAmount] = (0, import_react.useState)(defaults?.amount ?? "");
	const [description, setDescription] = (0, import_react.useState)(defaults?.description ?? "");
	const [occurredOn, setOccurredOn] = (0, import_react.useState)(defaults?.occurredOn ?? todayIso());
	const [place, setPlace] = (0, import_react.useState)(defaults?.place ?? "");
	const [categoryId, setCategoryId] = (0, import_react.useState)(defaults?.categoryId ?? "");
	const [accountId, setAccountId] = (0, import_react.useState)(defaults?.accountId ?? "");
	const [incomeSource, setIncomeSource] = (0, import_react.useState)(defaults?.incomeSource ?? "salario");
	const [newCat, setNewCat] = (0, import_react.useState)("");
	const cats = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const accounts = useQuery({
		queryKey: ["accounts"],
		queryFn: () => listAccounts()
	});
	(0, import_react.useEffect)(() => {
		if (defaults) {
			setAmount(defaults.amount);
			setDescription(defaults.description);
			setOccurredOn(defaults.occurredOn);
			setPlace(defaults.place);
			setCategoryId(defaults.categoryId);
			setAccountId(defaults.accountId);
			setIncomeSource(defaults.incomeSource);
		}
	}, [defaults]);
	const save = useMutation({
		mutationFn: async () => {
			const parsed = parseMoneyInput(amount);
			if (!parsed) throw new Error("Informe um valor válido.");
			const payload = {
				type,
				amount: parsed,
				description,
				occurredOn,
				place: place || void 0,
				categoryId: categoryId || null,
				accountId: accountId || null,
				incomeSource: type === "income" ? incomeSource : null
			};
			if (editingId) await updateTransaction({ data: {
				id: editingId,
				...payload
			} });
			else await createTransaction({ data: payload });
		},
		onSuccess: async () => {
			toast.success(editingId ? "Movimentação atualizada." : "Movimentação registrada.");
			await Promise.all([
				qc.invalidateQueries({ queryKey: ["dashboard"] }),
				qc.invalidateQueries({ queryKey: ["transactions"] }),
				qc.invalidateQueries({ queryKey: ["budget"] }),
				qc.invalidateQueries({ queryKey: ["insights"] }),
				qc.invalidateQueries({ queryKey: ["accounts"] })
			]);
			onCancel();
		},
		onError: (e) => toast.error(e.message)
	});
	const addCat = useMutation({
		mutationFn: async () => {
			const created = await createCategory({ data: { name: newCat } });
			setCategoryId(created.id);
			setNewCat("");
			await cats.refetch();
		},
		onError: (e) => toast.error(e.message)
	});
	const isExpense = type === "expense";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: editingId ? "Editar movimentação" : isExpense ? "Nova despesa" : "Nova receita" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: isExpense ? "Registre um gasto com data, local e categoria opcional." : "Registre um valor recebido." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "amount",
				children: "Valor"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "amount",
				className: "mt-1.5",
				inputMode: "decimal",
				placeholder: "25,00",
				value: amount,
				onChange: (e) => setAmount(e.target.value),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "description",
				children: "Descrição"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "description",
				className: "mt-1.5",
				placeholder: isExpense ? "Hambúrguer" : "Salário de setembro",
				value: description,
				onChange: (e) => setDescription(e.target.value),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "date",
				children: "Data"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "date",
				type: "date",
				className: "mt-1.5",
				value: occurredOn,
				onChange: (e) => setOccurredOn(e.target.value),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "place",
				children: isExpense ? "Loja / local" : "Origem (detalhe)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "place",
				className: "mt-1.5",
				placeholder: isExpense ? "Restaurante" : "Empresa",
				value: place,
				onChange: (e) => setPlace(e.target.value)
			})] }),
			isExpense ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria (opcional)" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: categoryId || "none",
					onValueChange: (v) => setCategoryId(v === "none" ? "" : v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-1.5",
						"aria-label": "Categoria",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sem categoria" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "none",
						children: "Sem categoria"
					}), (cats.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c.id,
						children: c.name
					}, c.id))] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Nova categoria",
						value: newCat,
						onChange: (e) => setNewCat(e.target.value),
						"aria-label": "Nome da nova categoria"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => addCat.mutate(),
						disabled: !newCat.trim(),
						children: "Criar"
					})]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Origem" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: incomeSource,
				onValueChange: setIncomeSource,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "mt-1.5",
					"aria-label": "Origem da receita",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: INCOME_SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: s.id,
					children: s.label
				}, s.id)) })]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Conta (opcional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: accountId || "none",
				onValueChange: (v) => setAccountId(v === "none" ? "" : v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "mt-1.5",
					"aria-label": "Conta",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Nenhuma" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "none",
					children: "Nenhuma"
				}), (accounts.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: a.id,
					children: a.name
				}, a.id))] })]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					className: "flex-1",
					onClick: onCancel,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "flex-1",
					disabled: save.isPending,
					children: save.isPending ? "Salvando…" : "Salvar"
				})]
			})
		]
	})] });
}
var NAV = [
	{
		to: "/app",
		label: "Início",
		icon: LayoutDashboard
	},
	{
		to: "/app/historico",
		label: "Histórico",
		icon: History
	},
	{
		to: "/app/metas",
		label: "Metas",
		icon: Flag
	},
	{
		to: "/app/graficos",
		label: "Gráficos",
		icon: ChartPie
	},
	{
		to: "/app/orcamento",
		label: "Orçamento",
		icon: Wallet
	},
	{
		to: "/app/perfil",
		label: "Perfil",
		icon: UserRound
	}
];
var MOBILE = [
	{
		to: "/app",
		label: "Início",
		icon: LayoutDashboard
	},
	{
		to: "/app/historico",
		label: "Histórico",
		icon: History
	},
	{
		to: "__add",
		label: "Adicionar",
		icon: Plus
	},
	{
		to: "/app/metas",
		label: "Metas",
		icon: Flag
	},
	{
		to: "/app/perfil",
		label: "Perfil",
		icon: UserRound
	}
];
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const openAdd = useAppStore((s) => s.openAdd);
	const { setTheme } = useTheme();
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe(),
		enabled: Boolean(user)
	});
	const notes = useQuery({
		queryKey: ["notifications"],
		queryFn: () => listNotifications(),
		enabled: Boolean(user)
	});
	(0, import_react.useEffect)(() => {
		if (me.data?.theme) setTheme(me.data.theme);
	}, [me.data?.theme, setTheme]);
	if (isPending || user && me.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-background text-muted-foreground",
		children: "Carregando…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Não foi possível carregar sua sessão." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void signOut("/"),
			children: "Sair"
		})]
	});
	if (me.data && !me.data.isActive) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Esta conta foi desativada." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void signOut("/"),
			children: "Sair"
		})]
	});
	if (me.data?.mustChangePassword) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin/senha" });
	if (me.data && !me.data.onboardingCompleted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	const unread = (notes.data ?? []).filter((n) => !n.read_at).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-sidebar p-4 lg:flex lg:flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLink, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mt-8 flex flex-1 flex-col gap-1",
						children: [
							NAV.map((item) => {
								const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
								}, item.to);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/configuracoes",
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", pathname.startsWith("/app/configuracoes") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), "Configurações"]
							}),
							me.data?.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin",
								className: "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }), "Administração"]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signOut("/"),
						className: "flex h-11 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sair"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLink, { compact: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "hidden text-sm text-muted-foreground lg:block",
							children: ["Olá, ", me.data?.name?.split(" ")[0] ?? user.displayName ?? "por aqui"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/notificacoes",
								className: "relative grid size-11 place-items-center rounded-md hover:bg-muted",
								"aria-label": "Notificações",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2 right-2 size-2 rounded-full bg-primary" }) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "hidden md:inline-flex",
								onClick: () => openAdd(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Adicionar"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "px-4 py-5 pb-28 md:px-6 lg:pb-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden",
				"aria-label": "Navegação principal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-5",
					children: MOBILE.map((item) => {
						const Icon = item.icon;
						if (item.to === "__add") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => openAdd(),
							className: "-mt-5 mx-auto flex size-14 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft",
							"aria-label": "Adicionar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
						}) }, "add");
						const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-14 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-primary" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
						}) }, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransactionSheet, {})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
