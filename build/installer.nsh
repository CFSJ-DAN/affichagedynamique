!macro customInstall
  ; Créer le répertoire d'application
  CreateDirectory "C:\APPS\affichagedynamique"
  CreateDirectory "C:\APPS\affichagedynamique\content"
  CreateDirectory "C:\APPS\affichagedynamique\db"
  
  ; Définir les permissions
  AccessControl::GrantOnFile "C:\APPS\affichagedynamique" "(S-1-5-32-545)" "FullAccess"
  AccessControl::GrantOnFile "C:\APPS\affichagedynamique\content" "(S-1-5-32-545)" "FullAccess"
  AccessControl::GrantOnFile "C:\APPS\affichagedynamique\db" "(S-1-5-32-545)" "FullAccess"
!macroend