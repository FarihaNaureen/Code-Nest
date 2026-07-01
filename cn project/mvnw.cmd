@echo off
set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.2.10-hotspot"
"%DIRNAME%.mvn\apache-maven-3.9.6\bin\mvn.cmd" %*
