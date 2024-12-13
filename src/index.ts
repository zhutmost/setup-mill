import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import * as io from '@actions/io'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

async function main(): Promise<void> {
  const millBinPath = path.join(process.cwd(), 'mill_bin')

  try {
    core.info('Installing mill ...')

    const millVersion: string = core.getInput('mill-version')
    const millDownloadPath: string = await tc.downloadTool(
      `https://github.com/lihaoyi/mill/releases/download/${millVersion}/${millVersion}`
    )
    await io.mkdirP(millBinPath)
    await io.cp(millDownloadPath, `${millBinPath}/mill`, { force: true })
    fs.chmodSync(`${millBinPath}/mill`, '0755')

    core.info(`Add mill to PATH ... ${millBinPath}`)
    core.addPath(millBinPath)

    await exec.exec('mill', ['version'])
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unknown error occurred.')
    }
  }
}

main()
