from django.db import models

# Order class
class Order(models.Model):
    idOrder = models.AutoField(primary_key=True)
    createdAt = models.DateTimeField(blank=True)  # Valor predeterminado agregado
    guarantee = models.BooleanField(default=False)
    notes = models.TextField(max_length=500, default="", blank=True)
    price = models.FloatField(default=0.0)  # Valor predeterminado agregado
    phoneNumber = models.CharField(max_length=30, default="", blank=True)  # Valor predeterminado agregado
    nameCustomer = models.CharField(max_length=100, default="")  # Valor predeterminado agregado
    surnameCustomer = models.CharField(max_length=100, default="", blank=True)  # Valor predeterminado agregado
    pieceName = models.CharField(max_length=100, default="", blank=True)  # Valor predeterminado agregado
    status = models.CharField(
        max_length=3,
        default="in"  # Valor predeterminado agregado
    )
    brandPhone = models.CharField(max_length=30, default="", blank=True)  # Valor predeterminado agregado
    modelPhone = models.CharField(max_length=50, default="")  # Valor predeterminado agregado
    defect = models.TextField(max_length=100, default="")  # Valor predeterminado agregado
    shipped = models.IntegerField(
        choices=[(0, "Not shipped"), (1, "Shipped"), (2, "In shop")],
        default=0  # Valor predeterminado agregado
    )
    clientAdviser = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)

    def __str__(self):
        return str(self.nameCustomer + " " + self.surnameCustomer)
