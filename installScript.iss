; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "monTool"
#define MyAppVersion "0.2.1"
#define MyAppPublisher "B00148740"
#define MyAppURL "monTool.vercel.app"
#define NSSM "/nssm/win32/nssm.exe"
#define NODE "nodev18.msi"

[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{F212E0CD-6914-4323-B61B-1DAA93112DBC}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableDirPage=yes
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
; Uncomment the following line to run in non administrative install mode (install for current user only.)
;PrivilegesRequired=lowest
OutputDir=C:\Users\My\Desktop\monTool-SetupFiles
OutputBaseFilename=mysetup5
Compression=lzma
SolidCompression=yes
SetupIconFile=ico.ico  
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "D:\GitHub\Group_Project\nodev18.msi"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\GitHub\Group_Project\monTool\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Run]
; postinstall launch

; install node
Filename: "{sys}\msiexec.exe"; Parameters: "/passive /i ""{app}\{#NODE}""";

; Add Firewall Rules
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall add rule name=""Node In"" program=""{commonpf64}\nodejs\node.exe"" dir=in action=allow enable=yes"; Flags: runhidden;
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall add rule name=""Node Out"" program=""{commonpf64}\nodejs\node.exe"" dir=out action=allow enable=yes"; Flags: runhidden;

; Add System Service
Filename: "{app}\{#NSSM}"; Parameters: "install {#MyAppName} ""{app}\monToolApp.bat"" "; Flags: runhidden;

Filename: "{sys}\net.exe"; Parameters: "start {#MyAppName}"; Flags: runhidden;

; Start page
Filename: "{app}\openPage.bat"; 

 ;[Tasks]

;Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; 

[Icons]
;Name: "{commonprograms}\{#MyAppName}"; Filename: "{app}\monToolApp.bat"; IconFilename: "{app}\ico.ico"   Tasks: desktopicon
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\monTool.url"; IconFilename: "{app}\ico.ico" ; 




[UninstallRun]
; Removes System Service
Filename: "{sys}\net.exe"; Parameters: "stop {#MyAppName}"; Flags: runhidden;
Filename: "{app}\{#NSSM}"; Parameters: "remove {#MyAppName} confirm"; Flags: runhidden;




; Remove all leftovers
Filename: "{sys}\rmdir"; Parameters: "-r ""{app}""";

