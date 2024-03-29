"""empty message

Revision ID: 9743f12a6190
Revises: 0a076ff8b14a
Create Date: 2023-01-19 18:33:49.484635

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9743f12a6190'
down_revision = '0a076ff8b14a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event', schema=None) as batch_op:
        batch_op.add_column(sa.Column('date_created', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('date_updated', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('event', schema=None) as batch_op:
        batch_op.drop_column('date_updated')
        batch_op.drop_column('date_created')

    # ### end Alembic commands ###
