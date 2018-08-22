from setuptools import setup, find_packages
setup(
    name="adevi",
    version="0.1",
    package_dir={"": "apps", "meduza": "./meduza"},
    packages=find_packages("apps") + ["meduza"],
)
