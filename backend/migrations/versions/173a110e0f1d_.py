"""empty message

Revision ID: 173a110e0f1d
Revises: f7f42bf9fb08
Create Date: 2023-02-04 01:04:17.221749

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '173a110e0f1d'
down_revision = 'f7f42bf9fb08'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('event_comment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('person', sa.String(length=200), nullable=True),
    sa.Column('content', sa.String(length=1000), nullable=False),
    sa.Column('archived', sa.Boolean(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['event.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('event_comment')
    # ### end Alembic commands ###
