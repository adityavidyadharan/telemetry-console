import PyInstaller.__main__
import argparse
import platform

mapping = {
  "Darwin": "mac",
  "Windows": "win",
  "Linux": "linux"
}

parser = argparse.ArgumentParser()
parser.add_argument('output', nargs='?', default=mapping[platform.system()])
# parser.add_argument('arch')
args = parser.parse_args()

# TODO support for arm64 on macos

# archs = {}
# if args.os == "mac":
#   archs = {
#     "x86_64": "x64",
#     "arm64": "arm64"
#   }

output = "python/dist/{}/".format(args.output)

print("Building for {}".format(args.output))
print("Output: {}".format(output))

if args.output == "mac":
  PyInstaller.__main__.run([
    'python/import.py',
    '--onefile',
    '--specpath=python/dist/',
    '--workpath=python/build',
    '--distpath={}'.format(output),
    '--target-arch={}'.format("x86_64"),
  ])
else:
  PyInstaller.__main__.run([
      'python/import.py',
      '--onefile',
      '--specpath=python/dist/',
      '--workpath=python/build',
      '--distpath={}'.format(output),
  ])

