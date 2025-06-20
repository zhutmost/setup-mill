import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import * as io from '@actions/io'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

async function downloadWithFallback(urls: string[]): Promise<string> {
  for (const url of urls) {
    try {
      console.log(`Try to download: ${url}`)
      const downloadedPath = await tc.downloadTool(url)
      console.log(`Successfully downloaded: ${downloadedPath}`)
      return downloadedPath
    } catch (error) {
      console.warn(`Download failed [${url}]: ${(error as Error).message}`)
      // continue to the next URL if download fails
    }
  }

  throw new Error('Cannot download from any of the provided URLs.')
}

async function main(): Promise<void> {
  const millBinPath = path.join(process.cwd(), 'mill_bin')

  try {
    core.info('Installing mill ...')

    const millVersion: string = core.getInput('mill-version')

    const millDownloadPath: string = await downloadWithFallback([
      `https://repo1.maven.org/maven2/com/lihaoyi/mill-dist/${millVersion}/mill-dist-${millVersion}-mill.sh`, // for 0.12.13 and later
      `https://repo1.maven.org/maven2/com/lihaoyi/mill-dist/${millVersion}/mill`, // for 0.12.6 to 0.12.11
      `https://github.com/lihaoyi/mill/releases/download/${millVersion}/${millVersion}`, // for 0.12.5 and earlier
    ])
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
