import frappe
import math


# def get_context(context):
#     users = frappe.db.count("User")
#     rounded_count = math.ceil(users/10) #set round total 
#     context.user_count = str(rounded_count)

@frappe.whitelist()
def get_count(user_name=""):
    # total number of Open tasks
    if not user_name:
        return frappe.db.count('User')