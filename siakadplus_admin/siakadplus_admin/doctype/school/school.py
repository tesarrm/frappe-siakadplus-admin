# Copyright (c) 2024, Tesar Rahmat Maulana and contributors
# For license information, please see license.txt

import subprocess
import frappe
import os
import requests
import json
from frappe.model.document import Document


class School(Document):
	pass


@frappe.whitelist()
def setup_wizard(site_name, admin_password):
	# login
	login_url = f'http://{site_name}:8001/api/method/login'
	login_data = {
		'usr': 'Administrator',  
		'pwd': admin_password 
	}
	response = requests.post(login_url, json=login_data)

	if response.status_code != 200:
		frappe.response["message"] = f"Failed to login. Status code: {response.status_code}"
		return

	cookies = response.cookies.get_dict()

	#setup wizard
	url = f"http://{site_name}:8001/api/method/frappe.desk.page.setup_wizard.setup_wizard.setup_complete"
	payload = json.dumps({
		"args": {
			"language": "en",
			"country": "Indonesia",
			"timezone": "Asia/Jakarta",
			"currency": "IDR"
		}
	})
	headers = {
		'Content-Type': 'application/json',
		'Cookie': f"full_name={cookies['full_name']}; sid={cookies['sid']}; system_user={cookies['system_user']}; user_id={cookies['user_id']}; user_image={cookies['user_image']}"
	}
	response = requests.request("POST", url, headers=headers, data=payload)
	
	if response.status_code == 200:
		frappe.response["message"] = "Success" 
	else:
		frappe.response["message"] = f"Failed to run setup wizard. Status code: {response.status_code}"


def on_submit_school(doc, method):
	domain = doc.domain
	site_name = f"{domain}.localhost"
	site_path = os.path.join('..', 'sites', site_name)
	admin_password = "abcABC123#"
    
	if not os.path.exists(site_path):
		# Step 1: Create a new site
		create_site_command = f"bench new-site {site_name} --mariadb-root-password root --admin-password {admin_password} --db-name db-siakadplus-{domain}"
		subprocess.run(create_site_command, shell=True, check=True)

		# Step 2: Install the app on the new site
		install_app_command = f"bench --site {site_name} install-app siakadplus"
		subprocess.run(install_app_command, shell=True, check=True)

		# Step 5: Restart Bench
		restart_bench_command = "bench restart"
		subprocess.run(restart_bench_command, shell=True, check=True)

		# Step 4: Setup Wizard
		setup_wizard(site_name, admin_password)

		frappe.msgprint("Ok")
	else:
		disable = 'on' if not doc.active else 'off' 

		disable_site_command = f"bench --site {site_name} set-maintenance-mode {disable}"
		subprocess.run(disable_site_command, shell=True, check=True)

		frappe.msgprint("Status changed")
