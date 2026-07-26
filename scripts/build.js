import { execSync } from 'child_process'
import fs, { readFileSync } from 'fs'
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { packageExtension } from '@lvce-editor/package-extension'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const extension = path.join(root, 'packages', 'extension')
const node = path.join(root, 'packages', 'node')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

await import('./build-extension.js')

const packageJson = JSON.parse(
  readFileSync(join(extension, 'package.json')).toString(),
)
delete packageJson.jest
delete packageJson.devDependencies

fs.writeFileSync(
  join(root, 'dist', 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
)
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json'),
)
const extensionJsonPath = join(root, 'dist', 'extension.json')
const extensionJson = JSON.parse(readFileSync(extensionJsonPath, 'utf8'))
extensionJson.rpc = extensionJson.rpc.map((rpc) => ({
  ...rpc,
  url: rpc.url.replace('../node/', 'node/'),
}))
fs.writeFileSync(
  extensionJsonPath,
  JSON.stringify(extensionJson, null, 2) + '\n',
)
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})
fs.cpSync(join(extension, 'dist'), join(root, 'dist', 'dist'), {
  recursive: true,
})
fs.cpSync(join(node, 'dist'), join(root, 'dist', 'node', 'dist'), {
  recursive: true,
})

const getAllDependencies = (obj) => {
  if (!obj) {
    return []
  }
  return [
    obj,
    ...Object.values(obj.dependencies || {}).flatMap(getAllDependencies),
  ]
}

const getDependencies = () => {
  const stdout = execSync(
    'npm list --omit=dev --all --json --long --workspace=packages/extension',
    {
      cwd: root,
    },
  ).toString()
  const tree = JSON.parse(stdout)
  const workspace = tree.dependencies?.[packageJson.name]
  const dependencies = Object.values(workspace?.dependencies || {})
    .flatMap(getAllDependencies)
    .filter((dependency) => !dependency.extraneous && dependency.path)
    .map((dependency) => dependency.path)
  return [...new Set(dependencies)]
}

const getDependencyPath = (dependency) => {
  const relativeToRoot = path.relative(root, dependency)
  if (
    relativeToRoot.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeToRoot)
  ) {
    throw new Error(`Dependency is outside the repository: ${dependency}`)
  }
  if (dependency.startsWith(`${extension}${path.sep}`)) {
    return path.relative(extension, dependency)
  }
  return relativeToRoot
}

const dependencies = getDependencies()
for (const dependency of dependencies) {
  fs.cpSync(dependency, join(root, 'dist', getDependencyPath(dependency)), {
    recursive: true,
  })
}

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
