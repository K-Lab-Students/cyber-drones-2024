  GNU nano 7.2                                     /etc/systemd/system/flask_app.service                                               
[Unit]
Description=Flask Application
After=network.target network-online.target

[Service]
User=admin
WorkingDirectory=/home/admin
ExecStart=/usr/bin/python3 /home/admin/app.py.
Restart=on-failure
StandardOutput=append:/home/admin/flask_app.log
StandardError=append:/home/admin/flask_app_error.log

[Install]
WantedBy=multi-user.target



