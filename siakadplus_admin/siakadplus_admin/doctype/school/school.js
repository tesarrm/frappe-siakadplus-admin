// Copyright (c) 2024, Tesar Rahmat Maulana and contributors
// For license information, please see license.txt

frappe.ui.form.on("School", {
	refresh(frm) {
        var school = frm.doc.domain
        frm.add_custom_button(__('Go to Site'), function() {
            var site_url = `http://${school}.localhost:8001`;  // Ganti dengan URL situs baru yang sesuai
            window.open(site_url, "_blank");
        });
	},
});

frappe.ui.form.on('School Backup', {
    download: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var site_name = `${frm.doc.domain}.localhost`;
        var file_name = child.file_name;

        console.log(site_name)
        console.log(file_name)

        frappe.call({
            method: 'siakadplus_admin.siakadplus_admin.doctype.school.school.download_backup',
            args: {
                site_name: site_name,
                file_name: file_name
            },
            callback: function(response) {
                if (response.message && response.message.file_url) {
                    var file_url = response.message.file_url;
                    window.open(file_url);
                } else {
                    frappe.msgprint(__('Unable to download the backup file'));
                }
                console.log(response)
            }
        });
    }
});

// frappe.ui.form.on('School Backup', {
//     download: function(frm, cdt, cdn) {
//         var child = locals[cdt][cdn];
//         var site_name = `${frm.doc.domain}.localhost`;
//         var file_name = child.file_name;
//         var url = `http://${site_name}:8001/backups/${file_name}`;

//         console.log(site_name);
//         console.log(file_name);
//         console.log(url);

//         // Fetch the file using GET request
//         fetch(url, {
//             method: 'GET',
//             credentials: 'include', // Include cookies in the request
//             headers: {
//                 'Cookie': "full_name=Administrator; sid=c998e155a673804cd0d10b51e5d5157e0b1077edbdd1d41a34d11432; system_user=yes; user_id=Administrator; user_image=" // Pass all cookies from the current document
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.blob();
//         })
//         .then(blob => {
//             // Create a link element to trigger the download
//             var a = document.createElement('a');
//             var url = window.URL.createObjectURL(blob);
//             a.href = url;
//             a.download = file_name;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//             window.URL.revokeObjectURL(url);
//         })
//         .catch(error => {
//             console.error('There has been a problem with your fetch operation:', error);
//             frappe.msgprint(__('Unable to download the backup file'));
//         });
//     }
// });

// frappe.ui.form.on('School Backup', {
//     download: function(frm, cdt, cdn) {
//         var child = locals[cdt][cdn];
//         var site_name = `${frm.doc.domain}.localhost`;
//         var file_name = child.file_name;
//         var url = `http://${site_name}:8001/backups/${file_name}`;

//         console.log(site_name);
//         console.log(file_name);
//         console.log(url);

//         // Membuat permintaan GET untuk mengunduh file
//         fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Cookie': 'full_name=Administrator; sid=c998e155a673804cd0d10b51e5d5157e0b1077edbdd1d41a34d11432; system_user=yes; user_id=Administrator; user_image='
//             }
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.blob();
//         })
//         .then(blob => {
//             // Membuat URL untuk file yang diunduh
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.style.display = 'none';
//             a.href = url;
//             a.download = file_name;
//             document.body.appendChild(a);
//             a.click();
//             window.URL.revokeObjectURL(url);
//         })
//         .catch(error => {
//             frappe.msgprint(__('Unable to download the backup file: ') + error);
//             console.error('There has been a problem with your fetch operation:', error);
//         });
//     }
// });

