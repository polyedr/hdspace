import sqlite3
conn = sqlite3.connect('UserSessions.sqlite')
cur = conn.cursor()

print('Before: ')
data = cur.execute('SELECT * FROM auth_user')
for d in data:
	print(d)

print('Deleteing')
cur.execute('DELETE FROM auth_user')
conn.commit()
f = "user@gmail.com"
print('After: ')
data = cur.execute('SELECT * FROM auth_user')
# data = cur.execute('SELECT id FROM auth_user WHERE email ="user@gmail.com"')
for d in data:
	print(d)

print('----------Done----------')
