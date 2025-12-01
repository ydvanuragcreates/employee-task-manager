from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from models import Employee

engine = create_engine('sqlite:///./sql_app.db')
inspector = inspect(engine)
print('Tables:', inspector.get_table_names())

Session = sessionmaker(bind=engine)
session = Session()

employees = session.query(Employee).all()
print(f'\nTotal employees in DB: {len(employees)}')
for emp in employees:
    print(f'  - {emp.name} ({emp.email}) - Owner: {emp.owner_id}')

session.close()
