# Generated by Django 2.2.7 on 2019-11-25 03:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('commits', '0009_auto_20191124_1745'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='commit',
            options={'ordering': ['-date']},
        ),
    ]