const { Command } = require('@oclif/command')
const Listr = require('listr')
const chalk = require('chalk')
const {
  GitValidators,
  checkLFSFilters,
  checkHelperVersion
} = require('../../utils/lm/requirements')

class LmInfoCommand extends Command {
  async run() {
    const steps = GitValidators
    steps.push(
      {
        title: 'Checking Git LFS filters',
        task: async () => {
          const installed = await checkLFSFilters()
          if (!installed) {
            throw new Error('Git LFS filters are not installed, run `git lfs install` to install them')
          }
        }
      },
      {
        title: `Checking Netlify's Git Credentials version`,
        task: async (ctx, task) => {
          const version = await checkHelperVersion()
          task.title += chalk.dim(` [${version}]`)
        }
      }
    )

    const tasks = new Listr(steps, { concurrent: true, exitOnError: false })
    tasks.run().catch((err) => { })
  }
}

LmInfoCommand.description = `Show large media requirements info.`
LmInfoCommand.hidden = true

LmInfoCommand.examples = ['netlify lm:info']

module.exports = LmInfoCommand