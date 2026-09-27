import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as APP_SLOGAN } from "./constants-aV2RQtvO.mjs";
import { C as ChartColumn, S as ChartPie, g as Lock, l as ShieldCheck, n as Wallet, o as TrendingUp, v as History, y as Flag } from "../_libs/lucide-react.mjs";
import { t as BrandLink } from "./brand-B0N51Sly.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DlLCLgMM.js
var import_jsx_runtime = require_jsx_runtime();
var FEATURES = [
	{
		icon: Wallet,
		title: "Controle de despesas",
		body: "Registre gastos com data, local e categoria, e veja para onde o dinheiro está indo."
	},
	{
		icon: TrendingUp,
		title: "Controle de receitas",
		body: "Acompanhe salário, freelancer e outras origens em um só lugar."
	},
	{
		icon: Flag,
		title: "Metas financeiras",
		body: "Defina objetivos, adicione valores e acompanhe o progresso com clareza."
	},
	{
		icon: ChartPie,
		title: "Gráficos",
		body: "Visualize receitas, despesas, categorias e a evolução do saldo com dados reais."
	},
	{
		icon: ChartColumn,
		title: "Orçamento",
		body: "Estabeleça um limite mensal e receba alertas ao se aproximar dele."
	},
	{
		icon: History,
		title: "Histórico",
		body: "Pesquise, filtre, edite e exclua movimentações com segurança."
	},
	{
		icon: ShieldCheck,
		title: "Segurança",
		body: "Senhas protegidas, sessões isoladas e dados que pertencem só a você."
	},
	{
		icon: Lock,
		title: "Organização financeira",
		body: "Painel, insights e configurações pensados para o dia a dia."
	}
];
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLink, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Entrar"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cadastro",
							children: "Começar agora"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tracking-wide text-primary",
							children: APP_SLOGAN
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display mt-3 max-w-xl text-4xl leading-tight font-medium tracking-tight md:text-5xl",
							children: "Finanças pessoais com clareza, sem ruído."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-lg text-muted-foreground",
							children: "Tenha uma visão clara das suas finanças, controle seus gastos, acompanhe suas metas e organize seu futuro financeiro."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/cadastro",
									children: "Começar agora"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: "Entrar"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroPreview, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4",
					children: FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-background p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-semibold",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: f.body
							})
						]
					}, f.title))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-3xl px-4 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mx-auto size-6 text-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-3xl",
						children: "Seus dados financeiros pertencem a você"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Cada conta é isolada. Transações, metas e contas de um usuário nunca ficam visíveis para outro. Senhas são armazenadas com hash seguro. Exportar ou excluir seus dados é uma escolha sua."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["FinTrack — ", APP_SLOGAN] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cadastro",
							className: "hover:text-foreground",
							children: "Criar conta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "hover:text-foreground",
							children: "Entrar"
						})]
					})]
				})
			})
		]
	});
}
function HeroPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Saldo disponível"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground",
					children: "Este mês"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-3xl font-semibold tabular",
				children: "R$ 0,00"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Receitas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold text-income tabular",
						children: "R$ 0,00"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-muted p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Despesas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg font-semibold tabular",
						children: "R$ 0,00"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 h-24 overflow-hidden rounded-lg bg-muted px-3 pt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 320 80",
					className: "h-full w-full text-primary",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0 60 C40 58 50 40 80 42 C110 44 120 22 160 28 C200 34 210 18 250 20 C280 22 300 12 320 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "3",
						strokeLinecap: "round"
					})
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
