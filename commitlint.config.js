/**
        'feat',         // 新功能 feature
        'fix',           // 一个错误修复
        'refactor',     // 重构(既不增加新功能，也不是修复bug)
        'docs',         // 仅文档更改
        'test',         // 添加缺失的测试或更正现有的测试
        'chore',        // 既不修正错误也不增加功能的代码更改
        'style',        // 不影响代码含义的更改（空白，格式，缺少分号等）
        'perf',         // 改进性能的代码更改
        'revert',       // 回退
 */
module.exports = { extends: ['@commitlint/config-conventional'] };
