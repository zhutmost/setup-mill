import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import * as io from '@actions/io'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import { compareVersions } from 'compare-versions'

async function main(): Promise<void> {
  const millBinPath = path.join(process.cwd(), 'mill_bin')

  try {
    core.info('Installing mill ...')

    const millVersion: string = core.getInput('mill-version')

    const millUrl: string = compareVersions(millVersion, '0.12.6', '>=')
      ? `https://repo1.maven.org/maven2/com/lihaoyi/mill-dist/${millVersion}/mill-dist-${millVersion}-mill.sh`
      : `https://github.com/lihaoyi/mill/releases/download/${millVersion}/${millVersion}`

    const millDownloadPath: string = await tc.downloadTool(millUrl)
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
