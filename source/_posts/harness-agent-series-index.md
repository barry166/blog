---
title: 从零实现 Harness Agent 系列目录
date: 2026-06-15 17:20:00
permalink: /series/harness-agent/
sticky: 1000
description: "从零实现 Harness Agent 系列目录，系统整理 tiny-claw 从 Python CLI、ReAct 主循环、工具系统、会话记忆、审批恢复到 Subagent 可观测性的完整实现路径。"
keywords:
  - Harness Agent
  - AI Agent 教程
  - tiny-claw
  - Python Agent
  - Agent 架构
comments: false
---

# 从零实现 Harness Agent 系列目录

这套系列记录如何从零实现一个可控、可恢复、可观察的 Harness Agent。它以 `tiny-claw` 为例，覆盖 Python CLI、模型 Provider、ReAct 主循环、受控工具系统、会话记忆、Plan Mode、飞书集成、人工审批、Subagent 与运行追踪。

如果你正在把 Agent 原型推进到真实工程项目，可以按顺序阅读；如果只关心某个模块，也可以直接跳到对应章节。

## 阅读路线

1. 基础运行时：CLI、应用装配、Provider、主循环。
2. 工具与安全边界：受控工具、局部编辑、并发执行、middleware、allowlist/denylist、人工审批。
3. 上下文与状态：skill 感知上下文、session memory、Plan Mode、上下文压缩。
4. 外部集成与恢复：飞书事件服务、审批 checkpoint、审批 adapter 和测试验证。
5. Subagent 与可观测性：Explorer Subagent、会话隔离、日志归属、真实链路测试、tracing 决策树。

## 全部文章

- 开篇：[从零实现 Harness Agent：从黑盒 Agent 到可控运行时](/2026/06/09/harness-agent/harness-agent-00-intro-black-box-agent-to-controllable-harness/)
  本文是 Harness Agent 系列开篇，解释为什么 AI Agent 需要可控、可恢复、可观察的运行时底座，并介绍 tiny-claw 的核心架构判断。
- 第 1 篇：[从零实现 Harness Agent：搭建分层 Python Agent CLI 框架](/2026/06/09/harness-agent/harness-agent-01-python-agent-cli-framework/)
  本文讲解如何为 tiny-claw 搭建分层 Python Agent CLI 框架，让入口、应用装配、主循环、Provider、工具和状态边界保持清晰。
- 第 2 篇：[从零实现 Harness Agent：模型无关的 ReAct 主循环](/2026/06/09/harness-agent/harness-agent-02-provider-neutral-react-main-loop/)
  本文讲解如何实现模型无关的 ReAct 主循环，让 Agent 可以构建上下文、调用 Provider、执行工具并在多轮流程中返回结果。
- 第 3 篇：[从零实现 Harness Agent：设计模型 Provider 适配层](/2026/06/09/harness-agent/harness-agent-03-provider-adapter-layer/)
  本文讲解 tiny-claw 的模型 Provider 适配层，如何用统一内部协议接入 OpenAI、Claude、Echo 和 FakeProvider。
- 第 4 篇：[从零实现 Harness Agent：构建默认受控的工具系统](/2026/06/09/harness-agent/harness-agent-04-controlled-tool-system/)
  本文讲解如何构建默认受控的 Agent 工具系统，让模型只能看到显式启用且经过上下文策略过滤的 read、write、edit、bash 工具。
- 第 5 篇：[从零实现 Harness Agent：实现安全的局部编辑工具](/2026/06/09/harness-agent/harness-agent-05-safe-local-edit-tool/)
  本文讲解如何实现安全的 EditTool，让 Agent 通过唯一匹配、路径校验和原子写入完成局部文本替换，而不是重写整个文件。
- 第 6 篇：[从零实现 Harness Agent：设计多工具并发执行器](/2026/06/09/harness-agent/harness-agent-06-parallel-tool-executor/)
  本文讲解 ToolExecutor 的多工具调度策略，说明为什么只读工具可以并发执行，而 write、edit、bash 等副作用工具必须顺序执行。
- 第 7 篇：[从零实现 Harness Agent：构建 Skill 感知上下文引擎](/2026/06/09/harness-agent/harness-agent-07-skill-aware-context-engine/)
  本文讲解 Skill-aware Context 引擎，如何把 AGENTS.md、skill index、active skill、recent memory 和用户输入组装成模型上下文。
- 第 8 篇：[从零实现 Harness Agent：会话隔离记忆设计](/2026/06/09/harness-agent/harness-agent-08-session-isolated-memory/)
  本文讲解 session-scoped memory 设计，让 CLI 默认会话、命名会话、飞书聊天和后续 Subagent 拥有独立的记忆与状态目录。
- 第 9 篇：[从零实现 Harness Agent：可恢复 Plan Mode 设计](/2026/06/09/harness-agent/harness-agent-09-resumable-plan-mode/)
  本文讲解 session-scoped Plan Mode，如何把 PLAN.md 和 TODO.md 从模型短期上下文中拿出来，变成可恢复、可检查的任务状态。
- 第 10 篇：[从零实现 Harness Agent：飞书事件服务接入](/2026/06/09/harness-agent/harness-agent-10-feishu-event-service/)
  本文讲解如何把飞书消息接入统一 HTTP 事件服务，让外部平台进入同一套 Application.run 和 MainLoop，而不是复制 Agent runtime。
- 第 11 篇：[从零实现 Harness Agent：上下文压缩器设计](/2026/06/09/harness-agent/harness-agent-11-context-compactor/)
  本文讲解 ContextCompactor 的设计，如何在不改写原始历史和 session memory 的前提下，为过长工具输出生成临时压缩视图。
- 第 12 篇：[从零实现 Harness Agent：工具错误 SOP 兜底机制](/2026/06/09/harness-agent/harness-agent-12-tool-error-sop-fallback/)
  本文讲解工具错误 SOP 兜底机制，如何把 read、edit、bash 等工具失败转换为模型可理解、用户可观测、测试可断言的反馈。
- 第 13 篇：[从零实现 Harness Agent：Agent CLI 测试策略](/2026/06/09/harness-agent/harness-agent-13-agent-cli-testing-strategy/)
  本文讲解 tiny-claw 的测试分层，用单元测试、FakeProvider、CLI 测试、集成测试和 live demo 分别约束 Agent runtime 的不稳定性。
- 第 14 篇：[从零实现 Harness Agent：Edit 工具的降级匹配管线](/2026/06/09/harness-agent/harness-agent-14-edit-degraded-matching-pipeline/)
  本文讲解 EditTool 的分层降级匹配管线，如何在换行、缩进和首尾空白存在差异时仍安全定位唯一 old_text。
- 第 15 篇：[从零实现 Harness Agent：真实 Provider 编辑演示](/2026/06/09/harness-agent/harness-agent-15-real-provider-edit-demo/)
  本文用真实 Provider 演示 Agent 编辑链路，验证模型生成工具调用、EditTool 执行局部修改以及最终结果回流主循环的完整路径。
- 第 16 篇：[从零实现 Harness Agent：Tool Middleware 链式执行](/2026/06/09/harness-agent/harness-agent-16-tool-middleware-chain/)
  本文讲解通用 Tool Middleware 链式执行，把审批、策略、日志和真实工具调用拆成可组合边界，避免工具执行器继续膨胀。
- 第 17 篇：[从零实现 Harness Agent：运行时工具 Allowlist/Denylist 策略](/2026/06/09/harness-agent/harness-agent-17-tool-policy-allowlist-denylist/)
  本文讲解运行时工具 allowlist 和 denylist 策略，区分模型可见工具与执行时二次拦截，避免不同环境下工具权限失控。
- 第 18 篇：[从零实现 Harness Agent：高危工具调用人工审批](/2026/06/09/harness-agent/harness-agent-18-human-approval-middleware/)
  本文讲解 HumanApprovalMiddleware，如何在高危工具参数命中风险策略时暂停 Agent 运行，把真实副作用交给人工审批。
- 第 19 篇：[从零实现 Harness Agent：审批 Checkpoint 暂停与恢复](/2026/06/09/harness-agent/harness-agent-19-approval-checkpoint-resume/)
  本文讲解审批 checkpoint 暂停与恢复机制，如何持久化原始 messages、pending tool call 和运行参数，并在人工决策后 fail closed 地继续。
- 第 20 篇：[从零实现 Harness Agent：飞书审批 Adapter 设计](/2026/06/09/harness-agent/harness-agent-20-feishu-approval-adapter/)
  本文讲解飞书审批 Adapter，如何把审批通知、approve、reject 命令接入通用审批流程，同时保持工具系统不依赖平台 SDK。
- 第 21 篇：[从零实现 Harness Agent：审批流程测试与验证](/2026/06/09/harness-agent/harness-agent-21-approval-flow-testing/)
  本文讲解高危工具审批流程的测试方法，区分模型拒绝、middleware 拦截、checkpoint 持久化、平台命令和审批后恢复。
- 第 22 篇：[从零实现 Harness Agent：MainLoop 审批恢复重构](/2026/06/09/harness-agent/harness-agent-22-mainloop-approval-resume-refactor/)
  本文讲解审批恢复进入主循环后的职责整理，如何拆出运行类型、工具策略、observation 处理和恢复 runner，避免 MainLoop 再次变成黑盒。
- 第 23 篇：[从零实现 Harness Agent：Explorer Subagent 运行时](/2026/06/09/harness-agent/harness-agent-23-explorer-subagent-runtime/)
  本文讲解同步、只读、上下文隔离的 Explorer Subagent，让复杂代码探索在 child session 中完成，只把精炼报告回流父循环。
- 第 24 篇：[从零实现 Harness Agent：Explore 工具适配器](/2026/06/09/harness-agent/harness-agent-24-explore-tool-adapter/)
  本文讲解如何把 Explorer Subagent 封装成普通 explore 工具，让父 MainLoop 不理解子智能体内部细节也能使用复杂探索能力。
- 第 25 篇：[从零实现 Harness Agent：Subagent 会话与记忆隔离](/2026/06/09/harness-agent/harness-agent-25-subagent-session-memory-isolation/)
  本文讲解 Subagent 的子会话与记忆隔离，说明 child session 如何记录探索过程，而父 session 只接收精炼报告。
- 第 26 篇：[从零实现 Harness Agent：Subagent 可观测性设计](/2026/06/09/harness-agent/harness-agent-26-subagent-observability/)
  本文讲解 Subagent 可观测性设计，如何通过日志标记启动、结束、child tool 调用和报告长度，让嵌套 Agent 行为可定位。
- 第 27 篇：[从零实现 Harness Agent：OpenAI Subagent 真实链路测试](/2026/06/09/harness-agent/harness-agent-27-openai-subagent-live-test/)
  本文讲解如何用真实 OpenAI Provider 验证 Explorer Subagent 端到端链路，观察父 Agent 调用 explore、子 Agent 调用 read 和报告回流。
- 第 28 篇：[从零实现 Harness Agent：工具并发边界设计](/2026/06/09/harness-agent/harness-agent-28-tool-concurrency-boundaries/)
  本文讲解工具并发边界，说明为什么连续 read 可以并发，而 write、edit、bash 和 explore 默认顺序执行。
- 第 29 篇：[从零实现 Harness Agent：Agent Tracing 决策树](/2026/06/09/harness-agent/harness-agent-29-agent-tracing-json-decision-tree/)
  本文讲解本地轻量级 Agent Tracing，如何把一次运行中的模型调用、工具调用、审批和 Subagent 行为记录成可回放的 JSON 决策树。

## 适合谁阅读

- 想理解 AI Agent 工程架构边界的开发者。
- 正在实现 Python Agent CLI 或本地自动化工具的工程师。
- 需要把工具调用、审批、恢复、Subagent 和可观测性接入真实项目的维护者。

## 下一步

建议从[开篇](/2026/06/09/harness-agent/harness-agent-00-intro-black-box-agent-to-controllable-harness/)开始阅读，再按章节进入工具系统、状态管理和 Subagent 设计。后续新增文章也会汇总到这个目录页。
